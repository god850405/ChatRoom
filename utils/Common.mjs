export const ToDateTime = (date = new Date(),separate=`-`) => {
    const result = new Date(date);
    const _yyyy = result.getFullYear();
    const _MM = result.getMonth()+1;const MM = PadLeft(_MM,2,'0');
    const _dd = result.getDate();const dd = PadLeft(_dd,2,'0');
    const _hh = result.getHours();const hh = PadLeft(_hh,2,'0');
    const _mm = result.getMinutes();const mm = PadLeft(_mm,2,'0');
    const _ss = result.getSeconds();const ss = PadLeft(_ss,2,'0');
    return `${_yyyy}${separate}${MM}${separate}${dd} ${hh}:${mm}:${ss}`;
}
export const PadLeft = (self,n , str) => {
    if (typeof(n) !=='number' || isNaN(n)) return '';
    let selfStr = `${self}`;
    let leftStr = '';
    for (let i =0 ; i<5 ;i++){
        leftStr += str;
    }
    return (leftStr + selfStr).slice(-n);
}
