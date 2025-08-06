/**
 * 기존 파일 유지 여부 판단
 * @param {Object} item - formStore.fieldArr의 각 항목
 * @param {String} fileKey - ex: 'instlFile'
 * @param {String} existingUrlKey - ex: 'fileNm', 'videoFileUrl'
 * @returns boolean
 */
export function shouldKeepExistingFile(item, fileKey, existingKey) {
  const newFile = item[fileKey]?.value;
  const existing = item[existingKey];

  const noNewFile = !newFile || (Array.isArray(newFile) && newFile.length === 0);
  const hasExisting = !!existing;

  return noNewFile && hasExisting;
}