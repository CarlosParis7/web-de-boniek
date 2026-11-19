import urllib.request
import re

url = 'https://dariifillms.webnode.es/'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    images = re.findall(r'https?://[^\s\"\'\(\)]+\.(?:jpg|jpeg|png|webp|gif)', html, re.IGNORECASE)
    with open('main_images.txt', 'w', encoding='utf-8') as f:
        for img in sorted(set(images)):
            f.write(img + '\n')
except Exception as e:
    pass
