from __future__ import annotations

import base64
import json
import re
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

import tensorflow as tf

from plant_disease_utils import DEFAULT_METADATA_PATH, DEFAULT_MODEL_PATH, decode_and_resize_image, load_metadata, prediction_payload


HOST = "127.0.0.1"
PORT = 8008

metadata = load_metadata(DEFAULT_METADATA_PATH)
class_names = list(metadata["classNames"])
image_size = int(metadata["imageSize"])
model = tf.keras.models.load_model(DEFAULT_MODEL_PATH, compile=False)


def build_response(handler: BaseHTTPRequestHandler, status: HTTPStatus, payload: dict) -> None:
    response = json.dumps(payload).encode("utf-8")
    handler.send_response(status)
    handler.send_header("Content-Type", "application/json")
    handler.send_header("Content-Length", str(len(response)))
    handler.end_headers()
    handler.wfile.write(response)


def decode_data_url(image_base64: str) -> tf.Tensor:
    match = re.match(r"^data:(image/[a-zA-Z0-9.+-]+);base64,(.+)$", image_base64)
    if not match:
        raise ValueError("Invalid image payload. Expected a base64 data URL.")

    try:
        raw_bytes = base64.b64decode(match.group(2), validate=True)
    except Exception as error:  # pragma: no cover - runtime validation path
        raise ValueError("Invalid base64 image payload.") from error

    return decode_and_resize_image(tf.convert_to_tensor(raw_bytes), image_size)


class PredictionHandler(BaseHTTPRequestHandler):
    def do_GET(self) -> None:
        if self.path == "/health":
            build_response(
                self,
                HTTPStatus.OK,
                {
                    "ready": True,
                    "modelPath": str(DEFAULT_MODEL_PATH),
                    "metadataPath": str(DEFAULT_METADATA_PATH),
                },
            )
            return

        build_response(self, HTTPStatus.NOT_FOUND, {"message": "Route not found"})

    def do_POST(self) -> None:
        if self.path != "/predict":
            build_response(self, HTTPStatus.NOT_FOUND, {"message": "Route not found"})
            return

        try:
            content_length = int(self.headers.get("Content-Length", "0"))
            raw_body = self.rfile.read(content_length)
            payload = json.loads(raw_body.decode("utf-8"))
            image_base64 = payload.get("imageBase64")

            if not image_base64:
                raise ValueError("imageBase64 is required.")

            image = decode_data_url(image_base64)
            probabilities = model.predict(tf.expand_dims(image, axis=0), verbose=0)[0]
            build_response(self, HTTPStatus.OK, prediction_payload(probabilities, class_names))
        except ValueError as error:
            build_response(self, HTTPStatus.BAD_REQUEST, {"message": str(error)})
        except Exception as error:  # pragma: no cover - defensive runtime path
            build_response(self, HTTPStatus.INTERNAL_SERVER_ERROR, {"message": str(error)})

    def log_message(self, format: str, *args) -> None:  # noqa: A003
        return


if __name__ == "__main__":
    server = ThreadingHTTPServer((HOST, PORT), PredictionHandler)
    print(f"Plant disease prediction service running on http://{HOST}:{PORT}")
    server.serve_forever()
