const REG = /\w\S*/g

export default function toTitleCase (str) {
  if (str == null) return null
  return str.replace(REG, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
}
