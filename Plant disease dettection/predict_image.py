from __future__ import annotations

import argparse
import json
from pathlib import Path

import tensorflow as tf

from plant_disease_utils import (
    DEFAULT_METADATA_PATH,
    DEFAULT_MODEL_PATH,
    decode_and_resize_image,
    load_metadata,
    prediction_payload,
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run plant disease inference on a single image.")
    parser.add_argument("--image", type=Path, required=True)
    parser.add_argument("--model-path", type=Path, default=DEFAULT_MODEL_PATH)
    parser.add_argument("--metadata-path", type=Path, default=DEFAULT_METADATA_PATH)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    if not args.image.exists():
        raise FileNotFoundError(f"Input image not found: {args.image}")
    if not args.model_path.exists():
        raise FileNotFoundError(f"Trained model not found: {args.model_path}")
    if not args.metadata_path.exists():
        raise FileNotFoundError(f"Model metadata not found: {args.metadata_path}")

    metadata = load_metadata(args.metadata_path)
    image_size = int(metadata["imageSize"])
    class_names = list(metadata["classNames"])

    model = tf.keras.models.load_model(args.model_path, compile=False)

    image_bytes = tf.io.read_file(str(args.image))
    image = decode_and_resize_image(image_bytes, image_size)
    probabilities = model.predict(tf.expand_dims(image, axis=0), verbose=0)[0]
    payload = prediction_payload(probabilities, class_names)

    print(json.dumps(payload))


if __name__ == "__main__":
    main()
