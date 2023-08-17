function setcookies(res, token) {
  let date = (new Date(Date.now() + 86400 * 1000))
  console.log(typeof date, date, "Date")
  let data = `token=${token}`
  res.cookie("user", data, {
    expires: date,
  });
}

export default setcookies