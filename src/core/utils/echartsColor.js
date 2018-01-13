let color = ['#88E7A7', '#FCE48A', '#FA6B67', '#FEB57F', '#C983FF', '#60A3F0', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3']

function getColor (index) {
  let size = color.length
  index = index % size
  return color[index]
}

export {
  color,
  getColor
}
