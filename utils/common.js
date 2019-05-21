function resetTime(time = 5000,that){
  let getTime = time
  let timer = null
  let m = 0
  let s = 0
  m = Math.floor(getTime/60%60)
  m<10&&(m='0'+m)
  s = Math.floor(getTime%60)
  function countDown(){
    s--;
    s < 10 && (s = '0' + s);
    if(s.length>=3){
      s = 59
      m = '0' + (Number(m)-1)
    }
    if (m.length >= 3) {
      m = '00';
      s = '00';
      clearInterval(timer);
    }
    that.setData({
      remainTime:m+':'+s
    })
  }
  timer = setInterval(countDown,1000)
}

module.exports = {
  resetTime: resetTime
}