const categorias =['bread','car','police_car','strawberry','calendar','sock','clock','helmet','mouth','candle','flip_flops','eye','umbrella','lightning','spoon','ladder','rifle','triangle','light_bulb','tent','fan','t-shirt','school_bus','moustache','drums','alarm_clock','mailbox','tooth','traffic_light','skateboard','stop_sign','flower','bulldozer','mushroom','tree','backpack','stairs','pizza','coffee_cup','bench','map','hat','key','saw','apple','chair','rainbow','paintbrush','square','snake','pillow','table','suitcase','pencil','tennis_racquet','bridge','wristwatch','moon','golf_club','ice_cream','syringe','cookie','cloud','ceiling_fan','power_outlet','bird','door','airplane','axe','book','pants','hot_dog','shovel','butterfly','microphone','bed','radio','beard','spider','hammer','eyeglasses','headphones','scissors','basketball','wheel','broom','cell_phone','dumbbell','knife','frying_pan','lollipop','line','sword','donut','circle','dog','mountain','face','dresser','bicycle','anvil','toothpaste','baseball','sun','garden_hose','cup','shorts','baseball_bat','smiley_face','blueberry','grapes','cat','diving_board','snowman','laptop','paper_clip','screwdriver','camera','envelope','star']

let modelo;
let cnv;

async function cargaModelo() {
	//cargamos nuestro modelo
	modelo = await tf.loadLayersModel('modelo/model.json');
}

function setup() {
	
	//cargamos el modelo
	cargaModelo();

	//creamos nuestro canvas
	//de 280*280 donde iran las imagens
	cnv = createCanvas(280, 280);
	//fondo blanco
	background(255);
	//una vez que se termine de dibujar predecimos el dibujo
	cnv.mouseReleased(predice);
	//lo ponemos es el html
	cnv.parent('canvas');

	//limpiamos la ventana cuando se apriete el boton y las predicciones
	//cuando se aprieta el boton limpia
	let clearButton = select('#limpia');
	clearButton.mousePressed(() => {
		background(255);
		select('#res').html('');
	});
}


//Funcion que predice la imagen del canvas usando TensorFlow js
function predice() {
	//Obtenemos los datos del canvas
	const entrada = obtenerImagen();

	//predecimos la entrada
	let predice = modelo.predict(tf.tensor([entrada]));

	//Obtenemos el arreglo con las probabilidades
	const proba = Array.from(predice.dataSync());

	// Obtenemos las probabilidades junto con su indice
	const proba_indice = proba.map((probabilidad, indice) => {
		return {
			indice,
			probabilidad
		}
	});

	//ordenamos de mayor a menor las probabilidades
	const ordenadas = proba_indice.sort((a, b) => b.probabilidad - a.probabilidad);
	//tomamos las 10 primeras
	const primeras = ordenadas.slice(0, 10);
	//imprimimos los resltados con su respectiva categorias
	const resultados = primeras.map(i => `<br>${categorias[i.indice]} (${(i.probabilidad.toFixed(4) * 100)}%)`);
	select('#res').html(resultados);
}

//funcion que nos regresa la informacion del canvas
function obtenerImagen() {
	let valores = [];
	//obtenemos la informacion del vanvas
	let img = get();
	//cambiamos el tamano para la entrada de nuestro modelo
	img.resize(28, 28);
	img.loadPixels();

	let linea = [];
	//recorremos todos nuestros pixeles 28*28=784
	for (let i = 0; i < 784; i++) {
		//normalizamos los pixeles
		let brillo = img.pixels[i * 4];
		let pixel = [parseFloat((255 - brillo) / 255)];
		linea.push(pixel);
		//si terinamos de leer una linea saltamos a la siguiente
		if (linea.length === 28) {
			valores.push(linea);
			linea = [];
		}
	}

	return valores;
}

//funcion del lapiz para dibujar en el canvas
function draw() {
	//funcion para dibujar en nuestro canvas
	strokeWeight(10);
	stroke(0);
	if (mouseIsPressed) {
		line(pmouseX, pmouseY, mouseX, mouseY);
	}
}