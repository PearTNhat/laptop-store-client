const caculatePercent = (price, priceDiscount) => {
    if (price === 0 || !price || priceDiscount === 0 || !priceDiscount) {
        return 0;
    }
    return Math.round((price - priceDiscount) / price * 100);
}
const formatNumber= (number) => {
    if (!number) {
        return 0
    }
    return number.toLocaleString('de-DE');
}
const convertNumberToStar = (number) => {
    if(!number){
        return [0,0,0,0,0];
    }
    number = Number(number);
    let stars = [];
    for (let i = 1; i <= number; i++) {
        stars.push(1);
    }
    if(number !==0 && number % Math.floor(number) !== 0) {
        stars.push(0.5);
        number ++;
    }
    for (let i = 5; i > number; i--) {
        stars.push(0);
    }
    return stars;
}
const getTimeHMS = (time) => {
    time = Number(time) / 1000;
    const hours = Math.floor(time /3600);
    const minutes =Math.floor( (time % 3600) / 60);
    const seconds =Math.floor( time % 60);
    return { hours, minutes, seconds };
}
export { caculatePercent ,formatNumber,convertNumberToStar,getTimeHMS}