import urllib.request
import re

url = 'https://dariifillms.webnode.es/mi-trabajo/'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    images = re.findall(r'https?://[^\s\"\'\(\)]+\.(?:jpg|jpeg|png|webp|gif)', html, re.IGNORECASE)
    for img in sorted(set(images)):
        print(img)
except Exception as e:
    print('Error:', e)
