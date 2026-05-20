from __future__ import annotations

import json
import random
import re
from pathlib import Path
from typing import Sequence

import numpy as np
import tensorflow as tf


WORKSPACE_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_DATASET_ROOT = WORKSPACE_ROOT / "pd" / "New Plant Diseases Dataset(Augmented)" / "New Plant Diseases Dataset(Augmented)"
DEFAULT_TEST_DIR = WORKSPACE_ROOT / "pd" / "test" / "test"
DEFAULT_MODEL_PATH = Path(__file__).resolve().with_name("trained_plant_disease_model.keras")
DEFAULT_METADATA_PATH = Path(__file__).resolve().with_name("model_metadata.json")


def get_dataset_paths(dataset_root: Path | None = None) -> dict[str, Path]:
    root = Path(dataset_root) if dataset_root else DEFAULT_DATASET_ROOT
    return {
        "root": root,
        "train": root / "train",
        "valid": root / "valid",
    }


def list_class_names(train_dir: Path) -> list[str]:
    return sorted(path.name for path in train_dir.iterdir() if path.is_dir())


def sample_file_label_pairs(
    split_dir: Path,
    class_names: Sequence[str],
    limit_per_class: int | None,
    seed: int,
) -> tuple[list[str], list[int]]:
    rng = random.Random(seed)
    file_paths: list[str] = []
    labels: list[int] = []

    for index, class_name in enumerate(class_names):
        class_dir = split_dir / class_name
        images = sorted(path for path in class_dir.iterdir() if path.is_file())
        if limit_per_class and len(images) > limit_per_class:
            images = sorted(rng.sample(images, limit_per_class))

        file_paths.extend(str(path) for path in images)
        labels.extend([index] * len(images))

    return file_paths, labels


def decode_and_resize_image(image_bytes: tf.Tensor, image_size: int) -> tf.Tensor:
    image = tf.io.decode_image(image_bytes, channels=3, expand_animations=False)
    image.set_shape([None, None, 3])
    image = tf.image.resize(image, [image_size, image_size])
    return tf.cast(image, tf.float32) / 255.0


def build_dataset(
    file_paths: Sequence[str],
    labels: Sequence[int],
    image_size: int,
    batch_size: int,
    training: bool,
) -> tf.data.Dataset:
    ds = tf.data.Dataset.from_tensor_slices((list(file_paths), list(labels)))
    if training:
        ds = ds.shuffle(len(file_paths), seed=42, reshuffle_each_iteration=True)

    def _load(path: tf.Tensor, label: tf.Tensor) -> tuple[tf.Tensor, tf.Tensor]:
        image_bytes = tf.io.read_file(path)
        image = decode_and_resize_image(image_bytes, image_size)
        return image, label

    ds = ds.map(_load, num_parallel_calls=tf.data.AUTOTUNE)
    ds = ds.batch(batch_size)
    return ds.prefetch(tf.data.AUTOTUNE)


def prettify_label_part(value: str) -> str:
    cleaned = value.replace("_", " ").replace(",", "")
    cleaned = cleaned.replace("(", " (")
    cleaned = re.sub(r"\s+", " ", cleaned)
    return cleaned.strip()


def split_label(label: str) -> tuple[str, str, bool]:
    crop_raw, disease_raw = label.split("___", 1)
    crop = prettify_label_part(crop_raw)
    disease = prettify_label_part(disease_raw)
    return crop, disease, disease.lower() == "healthy"


def recommendation_bundle(label: str) -> list[str]:
    crop, disease, is_healthy = split_label(label)
    disease_lc = disease.lower()

    if is_healthy:
        return [
            f"{crop} looks healthy. Continue routine scouting every 5 to 7 days.",
            "Keep leaves dry during irrigation where possible to reduce future fungal pressure.",
            "Maintain balanced nutrition and remove crop residue that can carry over infection.",
        ]

    if "virus" in disease_lc or "mosaic" in disease_lc or "curl" in disease_lc or "greening" in disease_lc:
        return [
            f"Isolate the affected {crop.lower()} plants if symptoms are spreading quickly.",
            "Control whiteflies, aphids, or other vectors and avoid moving tools between infected and clean plants.",
            "Remove severely affected leaves or plants and consult a local agronomist for virus management advice.",
        ]

    if "rust" in disease_lc or "blight" in disease_lc or "spot" in disease_lc or "scab" in disease_lc:
        return [
            "Inspect nearby plants for similar lesions before spraying the full plot.",
            "Reduce overhead irrigation and improve airflow by removing dense or heavily infected foliage.",
            "Use a crop-appropriate fungicide or integrated disease-control plan if symptoms continue to expand.",
        ]

    if "mildew" in disease_lc or "mold" in disease_lc:
        return [
            "Check humidity and canopy density because these diseases spread faster in damp conditions.",
            "Remove the most affected leaves and avoid wetting foliage late in the day.",
            "Use a recommended mildew or mold control treatment if the infection is actively progressing.",
        ]

    if "mite" in disease_lc:
        return [
            "Check the underside of leaves for mites and fine webbing.",
            "Avoid moisture stress and use a crop-safe miticide or biological control if infestation is active.",
            "Separate heavily affected plants and keep monitoring every 2 to 3 days.",
        ]

    return [
        f"Re-check the affected {crop.lower()} area within 24 hours to confirm symptom spread.",
        "Remove severely damaged leaves and keep tools clean between plants.",
        "Use local crop advisory guidance before applying any chemical treatment.",
    ]


def format_probability_rows(probabilities: np.ndarray, class_names: Sequence[str], top_k: int = 3) -> list[dict[str, object]]:
    top_indices = np.argsort(probabilities)[::-1][:top_k]
    rows = []
    for index in top_indices:
        crop, disease, is_healthy = split_label(class_names[index])
        rows.append(
            {
                "label": class_names[index],
                "crop": crop,
                "disease": disease,
                "isHealthy": is_healthy,
                "confidence": round(float(probabilities[index] * 100.0), 2),
            }
        )
    return rows


def prediction_payload(probabilities: np.ndarray, class_names: Sequence[str]) -> dict[str, object]:
    best_index = int(np.argmax(probabilities))
    predicted_class = class_names[best_index]
    crop, disease, is_healthy = split_label(predicted_class)

    return {
        "predictedClass": predicted_class,
        "crop": crop,
        "disease": disease,
        "isHealthy": is_healthy,
        "confidence": round(float(probabilities[best_index] * 100.0), 2),
        "topPredictions": format_probability_rows(probabilities, class_names, top_k=3),
        "recommendations": recommendation_bundle(predicted_class),
    }


TEST_NAME_TO_LABEL = {
    "AppleCedarRust": "Apple___Cedar_apple_rust",
    "AppleScab": "Apple___Apple_scab",
    "CornCommonRust": "Corn_(maize)___Common_rust_",
    "PotatoEarlyBlight": "Potato___Early_blight",
    "PotatoHealthy": "Potato___healthy",
    "TomatoEarlyBlight": "Tomato___Early_blight",
    "TomatoHealthy": "Tomato___healthy",
    "TomatoYellowCurlVirus": "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
}


def expected_label_from_test_filename(filename: str) -> str | None:
    for prefix, label in TEST_NAME_TO_LABEL.items():
        if filename.startswith(prefix):
            return label
    return None


def save_metadata(metadata_path: Path, payload: dict[str, object]) -> None:
    metadata_path.write_text(json.dumps(payload, indent=2), encoding="utf-8")


def load_metadata(metadata_path: Path) -> dict[str, object]:
    return json.loads(metadata_path.read_text(encoding="utf-8"))
