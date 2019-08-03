function $(el) {return document.querySelector(el);}
function $s(node) {return document.querySelectorAll(node);}
function show(el) {return el.style.display = 'inline-block';}
function hide(el) {return el.style.display = 'none';}
function log(pesan) {return console.log(pesan);}

const container = $('.container'),
    stopwatch = $('.stopwatch'),
    alarms = $('.alarm'),
    pp = $('.fa-play-circle'),
    loading = $('.stopwatch .loading');

//Nav bar Control
$s('.nav > a').forEach(function(el, index){
    el.addEventListener('click', function(e){
        for(let i = 0; i < $s('.nav > a').length; i++) $s('.nav > a')[i].style.backgroundColor = '#8C489F';
        e.preventDefault();
        el.style.backgroundColor = '#443266';
        if(index === 0){
            show(alarms);
            hide(stopwatch);
            hide(tm.main);
        }else if(index === 1){
            show(stopwatch);
            hide(tm.main);
            hide(alarms);
        }else if(index === 2){
            show(tm.main);
            hide(stopwatch);
            hide(alarms);
        }
    });
});

//Timer
let tm = {
    proggres: '',
    main: $('.tm'),
    pp: $('.tm .fa-play-circle'),
    repeat: $('.tm .fa-repeat'),
    loading: $('.tm .loading'),
    count: 0,
    hourSaved: '',
    minSaved: '',
    secSaved: ''
};
tm.loading.addEventListener('click', function () {
    let hours = Number($('input[name=hours]').value),
        min = Number($('input[name=min]').value),
        sec = Number($('input[name=sec]').value);
    if (hours === 0 && min === 0 && sec === 0) return;
    else {
        show(tm.repeat);
        if (tm.pp.getAttribute('class') === 'fa fa-play-circle fa-3x') {
            if (tm.count === 1) {
                if (tm.hourSaved !== $('input[name=hours]').value || tm.minSaved !== $('input[name=min]').value || tm.secSaved !== $('input[name=sec]').value) {
                    $('.start-at').innerHTML = digits(hours) + ':' + digits(min) + ':' + digits(sec);
                }
            } else {
                $('.start-at').innerHTML = digits(hours) + ':' + digits(min) + ':' + digits(sec);
                tm.count++;
            }
            tm.pp.setAttribute('class', 'fa fa-pause-circle fa-3x');
            tm.loading.classList.add('rotate');
            show($('.tm .opt'));
            tm.proggres = setInterval(function () {
                if (sec === 0) {
                    sec = 59;
                    if (min === 0) {
                        min = 59
                        if (hours === 0) {
                            min = 0;
                            sec = 0;
                            clearInterval(tm.proggres);
                            tm.loading.classList.remove('rotate');
                            tm.pp.setAttribute('class', 'fa fa-play-circle fa-3x');
                            tm.count = 0;
                            show($('.alert'));
                            if($('input[placeholder=Label]').value === '') $('#tmLabel').innerHTML = 'Timer';
                            else $('#tmLabel').innerHTML = $('input[placeholder=Label]').value;
                            $('#tmTime').innerHTML = $('.ctr .start-at').innerHTML;
                            $('audio').setAttribute('src', '../sfx/timer/alert.mp3');
                        } else hours--;
                    } else min--;
                } else sec--;
                $('input[name=hours]').value = digits(hours);
                $('input[name=min]').value = digits(min);
                $('input[name=sec]').value = digits(sec);
            }, 1000);
        } else {
            clearInterval(tm.proggres);
            tm.loading.classList.remove('rotate');
            tm.pp.setAttribute('class', 'fa fa-play-circle fa-3x');
            tm.hourSaved = $('input[name=hours]').value;
            tm.minSaved = $('input[name=min]').value;
            tm.secSaved = $('input[name=sec]').value;
        }
    }
});
$('.alert .close').addEventListener('click', function(e){
    hide(e.target.parentElement);
    $('audio').setAttribute('src', '');
});
tm.repeat.addEventListener('click', function () {
    function dapetin(from) {
        return $('.start-at').innerHTML.substr(from, 2);
    }
    clearInterval(tm.proggres);
    tm.loading.classList.remove('rotate');
    tm.pp.setAttribute('class', 'fa fa-play-circle fa-3x');
    $('input[name=hours]').value = dapetin(0);
    $('input[name=min]').value = dapetin(3);
    $('input[name=sec]').value = dapetin(6);
});
//Input handler
for (let i = 0; i < $s('input[type=number]').length; i++) {
    $s('input[type=number]')[i].addEventListener('input', function () {
        if (this.value.length > 2) return this.value = this.value.substr(0, 2);
        else if (this.value > 59) return this.value = this.value.charAt(0);
    });
}

//Stopwatch
let timer, h = 0, m = 0, s = 0, ms = 0;

function digits(numb) {
    if (numb.toString().length === 1) return numb = '0' + numb;
    else return numb;
}
loading.addEventListener('click', function () {
    if (pp.getAttribute('class') === 'fa fa-play-circle fa-3x') {
        pp.setAttribute('class', 'fa fa-pause-circle fa-3x');
        loading.classList.add('rotate');
        show($('.icn-btn'));
        timer = setInterval(function () {
            if (ms === 99) {
                ms = 0;
                if (s === 59) {
                    s = 0;
                    if (m === 59) {
                        m = 0;
                        h++;
                    } else m++;
                } else s++;
            } else ms++;
            $('.timer').innerHTML = digits(h) + ':' + digits(m) + ':' + digits(s) + ':' + digits(ms);
        }, 10);
    } else {
        clearInterval(timer);
        loading.classList.remove('rotate');
        pp.setAttribute('class', 'fa fa-play-circle fa-3x');
    }
});

function retry() {
    clearInterval(timer);
    loading.classList.remove('rotate');
    pp.setAttribute('class', 'fa fa-play-circle fa-3x');
    h = 0; m = 0; s = 0; ms = 0;
    $('.timer').innerHTML = '00:00:00:00';
}

$('.fa-undo').addEventListener('click', retry);

$('.fa-trash').addEventListener('click', function () {
    retry();
    $s('.add').forEach(function (el) {
        el.remove();
    });
    hide($('.history'));
    hide($('.icn-btn'));
});

$('.fa-edit').addEventListener('click', function () {
    if ($('.timer').innerHTML === '00:00:00:00') return;
    else {
        show($('.history'));
        stopwatch.removeAttribute('style');

        const li = document.createElement('li'),
            add = document.createElement('div'),
            label = document.createElement('input'),
            teks = document.createTextNode($('.timer').innerHTML),
            removeBtn = document.createElement('i');

        li.appendChild(teks);
        add.appendChild(li);
        add.appendChild(label);
        add.appendChild(removeBtn);
        $('ol').appendChild(add);

        add.classList.add('add');
        removeBtn.setAttribute('class', 'fa fa-remove');
        removeBtn.setAttribute('style', 'line-height: 30px');
        label.setAttribute('type', 'text');
        label.setAttribute('placeholder', 'Add label');

        $('ol').childNodes.forEach(function (el) {
            el.lastElementChild.addEventListener('click', function (e) {
                e.target.parentElement.remove();
            });
        });
    }
});

//Alarm
const alrm = {
    progress: '',
    hours: 0,
    min: 0
};
$('.track').addEventListener('click', function(){
    $('.thumb').classList.toggle('on');
    $('.alarm .timer').classList.toggle('fade');
    if($('.alarm h2').innerHTML === 'Off') {
        $('.alarm h2').innerHTML = 'On';
        alrm.progress = setInterval(function(){
            alrm.hours = new Date().getHours();
            alrm.min = new Date().getMinutes();
            if(alrm.hours == $('#hAlrm').value && alrm.min == $('#mAlrm').value){
                $('audio').setAttribute('src', '../sfx/timer/alert.mp3');
                $('#tmLabel').innerHTML = 'Alarm';
                $('#tmTime').innerHTML = $('#hAlrm').value + ':' + $('#mAlrm').value;
                show($('.alert'));
                clearInterval(alrm.progress);
                $('.thumb').classList.toggle('on');
                $('.alarm .timer').classList.toggle('fade');
                $('.alarm h2').innerHTML = 'Off';
            }
        }, 1000);
    }
    else {
        clearInterval(alrm.progress);
        $('.alarm h2').innerHTML = 'Off';
    }
});

//Next : alarm