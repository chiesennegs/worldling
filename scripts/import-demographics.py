"""Import public-domain Factbook fields from an extracted factbook/factbook.json checkout.
Usage: python3 scripts/import-demographics.py /path/to/factbook.json-master
"""
import sys, json, pathlib, html, re
root=pathlib.Path(sys.argv[1]); countries=json.load(open('src/data/countries.json'))
aliases={'ae':'ARE','io':'IOT','fm':'FSM','sh':'SHN','ct':'CAF','tu':'TUR','vt':'VAT','sx':'SGS','fk':'FLK','dr':'DOM','bf':'BHS','tb':'BLM','uc':'CUW','vq':'VIR','bm':'MMR','cv':'CPV','ga':'GMB','iv':'CIV','cf':'COG','tp':'STP','cg':'COD','um':'UMI'}
names={c['name'].lower():c['cca3'] for c in countries}
def clean(value):
 if isinstance(value,dict): value=value.get('text','')
 return re.sub(r'\s+',' ',html.unescape(re.sub('<[^>]*>',' ',value or ''))).strip()
records={}
for path in sorted(root.glob('*/*.json')):
 data=json.load(open(path)); gov=data.get('Government',{}); society=data.get('People and Society',{})
 code=aliases.get(path.stem) or names.get(clean(gov.get('Country name',{}).get('conventional short form')).lower())
 if not code: continue
 population=society.get('Population',{})
 records[code]={'population':clean(population.get('total') or population),'populationNote':clean(population.get('note')),'establishment':clean(gov.get('Independence')),'government':clean(gov.get('Government type')),'religion':clean(society.get('Religions')),'sourceURL':'https://github.com/factbook/factbook.json/blob/master/'+str(path.relative_to(root)),'retrieved':'2026-10-11'}
# Explicit disambiguations, otherwise the country index's common name is the article title.
titles={'GEO':'Georgia (country)','COG':'Republic of the Congo','COD':'Democratic Republic of the Congo','VAT':'Vatican City','PSE':'State of Palestine','USA':'United States','GBR':'United Kingdom','TUR':'Turkey','CIV':'Ivory Coast','FSM':'Federated States of Micronesia','KOR':'South Korea','PRK':'North Korea','VIR':'United States Virgin Islands','VGB':'British Virgin Islands','SHN':'Saint Helena, Ascension and Tristan da Cunha','BES':'Caribbean Netherlands','MAC':'Macau','CCK':'Cocos (Keeling) Islands','MAF':'Collectivity of Saint Martin','SXM':'Sint Maarten','UMI':'United States Minor Outlying Islands'}
for c in countries:
 rec=records.setdefault(c['cca3'],{})
 rec['wikipediaTitle']=titles.get(c['cca3'],c['name'])
pathlib.Path('src/data/demographics.json').write_text(json.dumps(records,ensure_ascii=False,indent=2)+'\n')
print(f'Imported {sum(bool(r.get("population")) for r in records.values())} population profiles; {len(records)} article links.')
print('Unmatched:', ', '.join(c['name'] for c in countries if not records[c['cca3']].get('sourceURL')))
