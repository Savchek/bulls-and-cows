let pressTimer
let mouseTarget
let wasLongPressed = false
let data = []
let plan=[]
let sNum = []

let game = false
let planning = false
let turn = 1

let pl = document.getElementById('play')
let tr = document.getElementById('turns')
let	sr = document.getElementById('surrender')

buildAnswers = () => {
    for (var a = [], d = 0; 10 > d; ++d)
        for (var b = 0; 10 > b; ++b)
            if (b != d)
                for (var c = 0; 10 > c; ++c)
                    if (c != b && c != d)
                        for (var e = 0; 10 > e; ++e) e != c && e != b && e != d && a.push([d, b, c, e])
    
	return a
}

let arr = buildAnswers(), z = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - .5)

z.push(z[Math.floor(Math.random()*4)], z[Math.floor(Math.random()*4)+4], 0)

start = () => {
	for (let i = 0; i < 4; i++){
		let s = Math.floor(Math.random() * 10)
		!(sNum.indexOf(s) != -1) ? sNum.push(s) : i--
	}
	
	pl.style.marginTop = '-130px'
	setTimeout(() => pl.style.display = 'none', 200)
	game = true
	wrt('Придумайте та введіть ваше число')
	document.getElementById('left').scrollTop = -999
	planning = true

	document.querySelectorAll('.n > div').forEach(e => e.classList = '')
}

reset = (lose) => {
	tr.style.marginTop = '-130px'

	setTimeout(() => {
		tr.style.display = sr.style.display = 'none'
		pl.style.display = 'flex'
		pl.style.marginTop = '0'
		tr.innerHTML = 'Хід #1'
	}, 200)

	game = false
	turn = 1

	if (lose){
		wrt('Ви здалися😢 Число суперника: ' + sNum.join(''), 'red')
	}

	for (let i = 0; i < 4; i++){
		document.getElementById('d'+i).innerHTML = ''
	}

	arr = buildAnswers(), z = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - .5)
	z.push(z[Math.floor(Math.random() * 4)], z[Math.floor(Math.random() * 4) + 4], 0)
	data = []
	sNum = []
}

blink = (el, color, time = 200) => {
	if (!el.classList.contains(color)) {
		el.classList.add(color)
	}

	setTimeout(() => el.classList.remove(color), time)
}

blinkTopNum = (color, onlyEmpty) => {
	for (let i = 0; i < 4; i++){
		let e = document.getElementById('d' + i)

		if (!onlyEmpty){
			blink(e, color)
		} else if (e.innerHTML == ''){
			blink(e, color)
		}
	}
}

addNum = num => {
	if (wasLongPressed) {
		return
	}

	if(game){
		let len = data.length

		if (num>=0){
			for (let i = 0; i < 4; i++){
				let el = document.getElementById('d' + i)

				if(!data[i] && !(data.indexOf(num) != -1) && data[i] != 0) {
					data[i] = el.innerHTML = num
					blink(el, 'green')

					break
				} else if(len == 4) {
					blink(document.getElementById('go'), 'green')
					blinkTopNum('green')

					break
				} else if(el.innerHTML == num && el.innerHTML!='') {
					blink(el, 'red')
					blink(document.getElementById('np'+num), 'red')
				}
			}
		} else if(num == -1) {
			if (len) {
				let deletedElement = document.getElementById('d' + data.indexOf( data[len-1] ) )

				deletedElement.innerHTML = ''
				blink(deletedElement, 'white')
				data.pop()
			} else {
				blinkTopNum('red')
				blink(document.getElementById('del'), 'red')
			}
		} else if(num == -2) {
			if (len < 4) {
				blinkTopNum('red', true)
				blink(document.getElementById('go'), 'red')

				return
			}

			if (planning){
				plan = [...data]
				data = []
				planning = false
				sr.style.display = tr.style.display = 'flex'
				tr.style.marginTop = '-130px'
				setTimeout(() => tr.style.marginTop = '0', 200)

				for (let i = 0; i < 4; i++) {
					document.getElementById('d'+i).innerHTML = ''
				}

				wrt('Суперник також загадав число')
				wrt('🚩Гра почалася🚩', 'text-center')
				blinkTopNum('green')
			} else {
				compare()
			}
		}
	} else {
		blink(document.getElementById('play'), 'red')
	}
}

compare = () => {
	let playerres = getBullsCows(data, sNum)
	let bulls = playerres.bulls
	let	cows = playerres.cows
		
	tr.innerHTML = 'Хід #' + (++turn)

	if(bulls == 4) {
		wrt('Ви виграли🎉 Число суперника: ' + sNum.join('') + ', Хід #' + (--turn), 'green')
		showConfetti(5)
		reset()
		blinkTopNum('green')
	} else if (bulls >= 0 && bulls < 4 && cows >= 0 && cows <= 4) {
		let botRes = choseAnswer()

		if (botRes.bulls == 4){
			wrt('🤖Cуперник виграв! Ваше число: ' + botRes.num.join('') + ', Число суперника: ' + sNum.join('') + ', Хід #' + (--turn), 'red')
			reset()
		} else {
			let bguessed = getVisGuess(botRes.bulls, botRes.cows)
			let pguessed = getVisGuess(playerres.bulls, playerres.cows)

			wrt('🤖Спроба суперника: ' + botRes.num.join('') + ' ' + bguessed)
			wrt('🤔️Ваша спроба: ' + data.join('') + ' ' + pguessed, 'user-output')
		}

		data = []
	}
}

getVisGuess = (bulls, cows) => {
	let guessed = '['
	let fb = 1
	let fc = 1

	for (let i = 0; i < 4; i++){
		document.getElementById('d' + i).innerHTML = ''
	}

	for (let b = 0; b < 4; b++){
		if(bulls > 0){
			guessed += '🐂'
			fb = 0
		}

		bulls--
	}

	guessed += fb ? '➖][' : ']['

	for (let c = 0; c < 4; c++) {
		if(cows > 0){
			guessed += '🐄'
			fc = 0
		}

		cows--
	}

	guessed += fc ? '➖]' : ']'

	return guessed
}

filterAnswers = (a, d) => {
    for (let b = a.length - 1; -1 < b; b--) {
		d(a[b]) || a.splice(b, 1)
	}
}

choseAnswer = () => {
	let num = getNum(arr)
	let resBK = getBullsCows(num, plan)
	let bulls = resBK.bulls
	let cows = resBK.cows

	filter = test(num, bulls, cows)
	filterAnswers(arr, filter)
	
	return {num, bulls, cows}
}

getBullsCows = (att, com) => {
	let bulls = 0
	let cows = 0

	att.forEach((attVal, attInd) => {
		com.forEach((comVal, comInd) => {
			if (attVal == comVal && attInd == comInd){
				bulls++
			} else if (attVal == comVal){
				cows++
			}
		})
	})

	return {bulls, cows}
}

test = (a, d, b) => {
    return c => {
        for (var e = 0, g = 0, h, f = 0; 4 > f; f++) a[f] == c[f] && g++, (h = (a[0] - c[f]) * (a[1] - c[f]) * (a[2] - c[f]) * (a[3] - c[f])) || e++
        return g != d ? !1 : e >= b
    }
}

getNum = a => z.length && a.length > 10 ? z.splice(0, 4) : a[Math.floor(Math.random() * a.length)]

wrt = (text, className) => {
	let a = document.getElementById('left')
	let b = document.getElementById('lastp')
	let neq = document.createElement('p')

	neq.classList.add(className)
	neq.style.marginTop = '-104px'
	neq.innerHTML = text
	a.insertBefore(neq, b)
	b.removeAttribute('id')
	neq.setAttribute('id', 'lastp')
	setTimeout(()=>neq.style.marginTop = 0,100)
	document.getElementById('left').scrollTop = -999
}

info = () => {
	wrt('v1.3.1')
	wrt('<a target="_blank" href="https://github.com/Savchek/bulls-and-cows/blob/master/LICENSE">Ліцензія MIT</a>')
	wrt('Розробив студент Університету імені Івана Франка Савченко Данило')
	wrt('Загальна інформація:')
}

markNumber = (event) => {
	event.preventDefault()

	const target = event.target

	if (turn <= 1 ||
		(target.dataset.num && target.dataset.num < 0)) {
		return
	}

	if (target.classList.contains('questionable')) {
		target.classList.remove('questionable')
		target.classList.add('ok')
	} else if (target.classList.contains('ok')) {
		target.classList.remove('ok')
		target.classList.add('rejected')
	} else if (target.classList.contains('rejected')) {
		target.classList.remove('rejected')
	} else {
		target.classList.add('questionable')
	}
}

showConfetti = (duration) => {
	var duration = duration * 1000;
	var animationEnd = Date.now() + duration;
	var skew = 1;
	var colors = ['#bb0000', '#ffffff', '#bada55', '#ff00ff']

	function randomInRange(min, max) {
		return Math.random() * (max - min) + min;
	}

	(function frame() {
		var timeLeft = animationEnd - Date.now();
		var ticks = Math.max(200, 500 * (timeLeft / duration));
		skew = Math.max(0.8, skew - 0.001);

		confetti({
			particleCount: 4,
			// startVelocity: 0,
			ticks: ticks,
			colors: colors,
			origin: {
				x: Math.random(),
				y: Math.random()
				// y: (Math.random() * skew) - 0.2
			},
			gravity: randomInRange(0.4, 0.6),
			scalar: randomInRange(0.4, 1),
			drift: randomInRange(-0.4, 0.4)
		});

		if (timeLeft > 0) {
			requestAnimationFrame(frame);
		}
	}());
}

document.querySelectorAll('.n > div').forEach(numBtn => {
	numBtn.addEventListener('contextmenu', markNumber)

	numBtn.addEventListener('mousedown', (event) => {
		if(event.button != 0) {
			return
		}
	
		mouseTarget = event.target
		
		pressTimer = setTimeout(() => {
			markNumber(event)
			wasLongPressed = true
		}, 500)
	})
})

document.body.addEventListener('mouseup', (event) => {
	clearTimeout(pressTimer)

	if(event.button != 0 || (mouseTarget && mouseTarget != event.target)) {
		mouseTarget = undefined
		return
	}

	mouseTarget = undefined
	
	if (event.target.dataset.num != undefined) {
		addNum(event.target.dataset.num)
	}

	wasLongPressed = false
})
