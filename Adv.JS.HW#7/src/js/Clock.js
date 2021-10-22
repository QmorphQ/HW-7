let clock = function (id_selecor) {return clock = new function(){
    this.name = "clock";
    this.id_selector = id_selecor;
    this.element_onPage =  document.querySelector(`#${this.id_selector}`);
    this.intervalID = 0;
    this.turn_on = () => {
        this.intervalID = setInterval(() => {
            clock.element_onPage.innerHTML = `${new Date().getHours() < 10 ? "0" + new Date().getHours() : new Date().getHours()} : ${new Date().getMinutes() < 10 ? "0" + new Date().getMinutes() : new Date().getMinutes()}`
        }, 1000)
    };
    this.turn_off = () => clearInterval(this.intervalID);
}};



