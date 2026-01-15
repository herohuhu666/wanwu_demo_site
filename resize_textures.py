from PIL import Image
import os

def resize_image(path, max_size=(1024, 1024)):
    try:
        if not os.path.exists(path):
            print(f"File not found: {path}")
            return

        with Image.open(path) as img:
            print(f"Original size of {path}: {img.size}")
            img.thumbnail(max_size)
            img.save(path, optimize=True, quality=85)
            print(f"Resized {path} to {img.size}")
    except Exception as e:
        print(f"Error resizing {path}: {e}")

base_dir = "/home/ubuntu/wanwu_demo_site/client/public/images"
resize_image(os.path.join(base_dir, "turtle_shell.png"))
resize_image(os.path.join(base_dir, "coin_texture.png"))
