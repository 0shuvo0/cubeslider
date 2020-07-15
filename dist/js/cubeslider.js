var initCubeSlider = function(ops){
	var o = Object.assign({
				row: 2,
				col: 3,
				size: 100,
				interval: 2500,
				delay: 50,
				transition: 500,
				controls: false
			}, ops)
	
	var size = o.size
	var height = o.row * size
	var width = o.col * size
	
	var el = document.querySelector(o.el)
	el.style.height = height + "px"
	el.style.width = width + "px"
	
	var len = o.slides.length
	if(!len) return
	len = len < 7 ? len : 6
	
	var imgs = []
	var images = []
	
	var canvas = document.createElement('canvas')
	canvas.height = height
	canvas.width = width
	var ctx = canvas.getContext('2d')
	
	var styles = [
		["translateZ(", "px)"],
		["translateZ(-", "px) rotateY(-90deg)"],
		["translateZ(-", "px) rotateY(180deg)"],
		["translateZ(-", "px) rotateY(90deg)"],
		["translateZ(-", "px) rotateX(90deg)"],
		["translateZ(-", "px) rotateX(-90deg)"]
	]
	
	var count = 1
	var render = undefined
	var showNext = function(){
		count++
		var prev = count === 1 ? 6 : count - 1
		el.classList.remove("slide-" + prev)
		el.classList.add("slide-" + count)
		if(count > len){
			count = 1
		}
	}
	var showPrev = function(){
		var prev = count === 1 ? 6 : count - 1
		el.classList.remove("slide-" + count)
		el.classList.add("slide-" + prev)
		count--
		if(count < 1){
			count = 6
		}
	}
	var runSlider = function(){
		render = setInterval(showNext, o.interval)
	}
	
	var addControls = function(){
		var panel = document.createElement('div')
		panel.classList.add("ctrl-panel")
		
		var lctrl = document.createElement('span')
		lctrl.classList.add('ctrl')
		lctrl.classList.add('left')
		lctrl.addEventListener('click', function(){
			clearInterval(render)
			showPrev()
			render = setInterval(showNext, o.interval)
		})
		panel.appendChild(lctrl)
		
		var rctrl = document.createElement('span')
		rctrl.classList.add('ctrl')
		rctrl.classList.add('right')
		rctrl.addEventListener('click', function(){
			clearInterval(render)
			showNext()
			render = setInterval(showNext, o.interval)
		})
		panel.appendChild(rctrl)
		
		el.appendChild(panel)
	}
	
	var createCube = function(num, index){
		var cube = document.createElement('div')
		cube.classList.add('cube')
		cube.style.height = size + "px"
		cube.style.width = size + "px"
		cube.style.transition = "transform " + (o.transition / 1000) + "s"
		for(var i = 0; i < num; i++){
			var side = document.createElement('canvas')
			side.height = size
			side.width = size
			var c = side.getContext('2d')
			c.putImageData(imgs[i][index], 0, 0)
			if(size !== 100){
				side.style.transform = styles[i][0] + (size / 2) + styles[i][1]
			}
			side.classList.add('side')
			cube.appendChild(side)
		}
		return cube
	}
	
	var init = function(){
		for(var i = 0; i < (o.row * o.col); i++){
			var cube = createCube(len, i)
			cube.style.transitionDelay = (i * (o.delay / 1000)) + "s"
			el.appendChild(cube)
		}
		if(o.controls){
			addControls()
		}
		if(len > 1){
			runSlider()
		}
	}
	
	var draw = function(img, i){
		ctx.drawImage(img, 0, 0, width, height)
		var sides = []
		for(var i = 0; i < o.row; i++){
			for(var j = 0; j < o.col; j++){
				sides.push(ctx.getImageData(size * j, size * i, size, size))
			}
		}
		imgs.push(sides)
		ctx.clearRect(0, 0, height, width)
	}
	
	var run = function(img){
		images.push(img)
		if(images.length === len){
			for(var j = 0; j < len; j++){
				draw(images[j], j)
			}
			init()
		}
	}
	
	var render = function(img){
		var image = new Image()
		image.src = img
		image.onload = function(){
			run(image)
		}
	}
	
	for(var i = 0; i < len; i++){
		render(o.slides[i])
	}
}