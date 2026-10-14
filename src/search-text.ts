/** Let users find accented place names with ordinary keyboard spellings. */
export function searchText(value: string) {
  return value.normalize("NFD").replace(/\p{M}/gu, "").toLocaleLowerCase();
}
