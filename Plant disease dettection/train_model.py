from __future__ import annotations

import argparse
import json
import random
from pathlib import Path

import numpy as np
import tensorflow as tf

from plant_disease_utils import (
    DEFAULT_DATASET_ROOT,
    DEFAULT_METADATA_PATH,
    DEFAULT_MODEL_PATH,
    DEFAULT_TEST_DIR,
    build_dataset,
    expected_label_from_test_filename,
    get_dataset_paths,
    list_class_names,
    sample_file_label_pairs,
    save_metadata,
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Train a plant disease classifier from the local dataset archive.")
    parser.add_argument("--dataset-root", type=Path, default=DEFAULT_DATASET_ROOT)
    parser.add_argument("--test-dir", type=Path, default=DEFAULT_TEST_DIR)
    parser.add_argument("--model-path", type=Path, default=DEFAULT_MODEL_PATH)
    parser.add_argument("--metadata-path", type=Path, default=DEFAULT_METADATA_PATH)
    parser.add_argument("--history-path", type=Path, default=Path(__file__).resolve().with_name("training_history_runtime.json"))
    parser.add_argument("--image-size", type=int, default=128)
    parser.add_argument("--batch-size", type=int, default=32)
    parser.add_argument("--epochs", type=int, default=6)
    parser.add_argument("--train-limit-per-class", type=int, default=180)
    parser.add_argument("--valid-limit-per-class", type=int, default=70)
    parser.add_argument("--seed", type=int, default=42)
    return parser.parse_args()


def set_reproducible_seed(seed: int) -> None:
    random.seed(seed)
    np.random.seed(seed)
    tf.keras.utils.set_random_seed(seed)


def build_model(image_size: int, class_count: int) -> tf.keras.Model:
    data_augmentation = tf.keras.Sequential(
        [
            tf.keras.layers.RandomFlip("horizontal"),
            tf.keras.layers.RandomRotation(0.05),
            tf.keras.layers.RandomZoom(0.08),
        ],
        name="data_augmentation",
    )

    inputs = tf.keras.Input(shape=(image_size, image_size, 3))
    x = data_augmentation(inputs)
    x = tf.keras.layers.Conv2D(32, 3, padding="same", activation="relu")(x)
    x = tf.keras.layers.BatchNormalization()(x)
    x = tf.keras.layers.MaxPooling2D()(x)

    x = tf.keras.layers.SeparableConv2D(64, 3, padding="same", activation="relu")(x)
    x = tf.keras.layers.BatchNormalization()(x)
    x = tf.keras.layers.MaxPooling2D()(x)

    x = tf.keras.layers.SeparableConv2D(128, 3, padding="same", activation="relu")(x)
    x = tf.keras.layers.BatchNormalization()(x)
    x = tf.keras.layers.MaxPooling2D()(x)

    x = tf.keras.layers.SeparableConv2D(256, 3, padding="same", activation="relu")(x)
    x = tf.keras.layers.BatchNormalization()(x)
    x = tf.keras.layers.GlobalAveragePooling2D()(x)
    x = tf.keras.layers.Dropout(0.35)(x)
    x = tf.keras.layers.Dense(256, activation="relu")(x)
    x = tf.keras.layers.Dropout(0.2)(x)
    outputs = tf.keras.layers.Dense(class_count, activation="softmax")(x)

    model = tf.keras.Model(inputs=inputs, outputs=outputs, name="plant_disease_classifier")
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3),
        loss="sparse_categorical_crossentropy",
        metrics=["accuracy"],
    )
    return model


def evaluate_named_test_images(
    model: tf.keras.Model,
    test_dir: Path,
    class_names: list[str],
    image_size: int,
) -> dict[str, object]:
    if not test_dir.exists():
        return {"evaluated": 0, "accuracy": None, "samples": []}

    samples = []
    correct = 0
    total = 0

    for image_path in sorted(path for path in test_dir.iterdir() if path.is_file()):
        expected_label = expected_label_from_test_filename(image_path.name)
        if not expected_label:
            continue

        image_bytes = tf.io.read_file(str(image_path))
        image = tf.io.decode_image(image_bytes, channels=3, expand_animations=False)
        image.set_shape([None, None, 3])
        image = tf.image.resize(image, [image_size, image_size])
        image = tf.cast(image, tf.float32) / 255.0
        probabilities = model.predict(tf.expand_dims(image, axis=0), verbose=0)[0]
        predicted_label = class_names[int(np.argmax(probabilities))]

        total += 1
        if predicted_label == expected_label:
            correct += 1

        samples.append(
            {
                "file": image_path.name,
                "expectedLabel": expected_label,
                "predictedLabel": predicted_label,
                "confidence": round(float(np.max(probabilities) * 100.0), 2),
            }
        )

    accuracy = round((correct / total) * 100.0, 2) if total else None
    return {"evaluated": total, "accuracy": accuracy, "samples": samples}


def main() -> None:
    args = parse_args()
    set_reproducible_seed(args.seed)

    dataset_paths = get_dataset_paths(args.dataset_root)
    train_dir = dataset_paths["train"]
    valid_dir = dataset_paths["valid"]

    if not train_dir.exists() or not valid_dir.exists():
        raise FileNotFoundError(f"Dataset folders not found under {args.dataset_root}")

    class_names = list_class_names(train_dir)
    train_paths, train_labels = sample_file_label_pairs(
        train_dir,
        class_names,
        limit_per_class=args.train_limit_per_class,
        seed=args.seed,
    )
    valid_paths, valid_labels = sample_file_label_pairs(
        valid_dir,
        class_names,
        limit_per_class=args.valid_limit_per_class,
        seed=args.seed + 1,
    )

    print(f"Training with {len(train_paths)} images across {len(class_names)} classes.")
    print(f"Validation with {len(valid_paths)} images.")

    train_ds = build_dataset(train_paths, train_labels, args.image_size, args.batch_size, training=True)
    valid_ds = build_dataset(valid_paths, valid_labels, args.image_size, args.batch_size, training=False)

    model = build_model(args.image_size, len(class_names))
    callbacks = [
        tf.keras.callbacks.EarlyStopping(monitor="val_accuracy", patience=2, restore_best_weights=True),
        tf.keras.callbacks.ReduceLROnPlateau(monitor="val_loss", factor=0.5, patience=1, min_lr=1e-5),
    ]

    history = model.fit(
        train_ds,
        validation_data=valid_ds,
        epochs=args.epochs,
        callbacks=callbacks,
        verbose=1,
    )

    val_loss, val_accuracy = model.evaluate(valid_ds, verbose=0)
    model.save(args.model_path)

    test_results = evaluate_named_test_images(model, args.test_dir, class_names, args.image_size)

    metadata = {
        "classNames": class_names,
        "imageSize": args.image_size,
        "batchSize": args.batch_size,
        "epochsRequested": args.epochs,
        "epochsTrained": len(history.history.get("loss", [])),
        "trainSamples": len(train_paths),
        "validationSamples": len(valid_paths),
        "trainLimitPerClass": args.train_limit_per_class,
        "validLimitPerClass": args.valid_limit_per_class,
        "validationAccuracy": round(float(val_accuracy * 100.0), 2),
        "validationLoss": round(float(val_loss), 4),
        "testSet": test_results,
        "modelPath": str(args.model_path),
        "datasetRoot": str(args.dataset_root),
    }

    save_metadata(args.metadata_path, metadata)
    args.history_path.write_text(json.dumps(history.history, indent=2), encoding="utf-8")

    print(json.dumps(metadata, indent=2))


if __name__ == "__main__":
    main()
