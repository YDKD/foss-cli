const toHumpName = (name: string) => {
  let humpName = name

  if (humpName.indexOf('-') !== -1) {

    const _splitArr = humpName.split('-')
    const after = _splitArr[1]

    humpName = _splitArr[0] + after[0].toUpperCase() + after.substr(1)
  }

  return humpName
}

export {
  toHumpName
}
