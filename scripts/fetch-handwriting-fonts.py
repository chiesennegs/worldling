"""Bundle unmodified OFL fonts and licenses from Google's official font repository."""
import urllib.request, urllib.error, pathlib, json, concurrent.futures
families={'marckscript':'MarckScript-Regular.ttf','mynerve':'Mynerve-Regular.ttf','gveretlevin':'GveretLevin-Regular.ttf','arefruqaa':'ArefRuqaa-Regular.ttf','kalam':'Kalam-Regular.ttf','kleeone':'KleeOne-Regular.ttf','liujianmaocao':'LiuJianMaoCao-Regular.ttf'}
def fetch(item):
 family,filename=item
 for name in [filename,'OFL.txt','METADATA.pb'] + ([] if family == 'gveretlevin' else ['DESCRIPTION.en_us.html']):
  url=f'https://raw.githubusercontent.com/google/fonts/main/ofl/{family}/{name}'
  destination=pathlib.Path('public/fonts')/(filename if name==filename else f'{family}-{name}')
  if destination.exists(): continue
  try:
   with urllib.request.urlopen(url,timeout=45) as r: destination.write_bytes(r.read())
  except urllib.error.HTTPError as error:
   if name != 'DESCRIPTION.en_us.html' or error.code != 404: raise
 return filename
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
 for filename in pool.map(fetch,families.items()): print(filename)
pathlib.Path('public/fonts/README.md').write_text('# Bundled handwriting fonts\n\nWOFF2-compressed original font outlines from https://github.com/google/fonts/tree/main/ofl, downloaded 2026-10-11. Each family includes its original OFL license, metadata, and description.\n\n'+ '\n'.join(f'- {filename.replace(".ttf",".woff2")}: https://github.com/google/fonts/tree/main/ofl/{family}' for family,filename in families.items())+'\n')

# WOFF2 compresses the original outlines; no glyphs are substituted or synthesized.
from fontTools.ttLib import TTFont
for filename in families.values():
 original = pathlib.Path('public/fonts') / filename
 font = TTFont(original)
 font.flavor = 'woff2'
 font.save(original.with_suffix('.woff2'))
 original.rename(pathlib.Path('/tmp') / ('worldling-' + filename))
