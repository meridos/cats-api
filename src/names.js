function trimSymbols(name) {
  let startIndex = 0;
  for (let i = 0; i < name.length; i++) {
    const symbol = name[i];
    if (/[a-zA-Zа-яА-Я]/.test(symbol)) {
      startIndex = i;
      break;
    }
  }

  let endIndex = 0;
  for (let i = name.length - 1; i >= 0; i--) {
    const symbol = name[i];
    if (/[a-zA-Z1-9а-яА-Я]/.test(symbol)) {
      endIndex = i;
      break;
    }
  }

  return name.substring(startIndex, endIndex + 1);
}