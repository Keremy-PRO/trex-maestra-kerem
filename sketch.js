var trex;
var running;//paso 1 - Creo la variable
var piso, pisoImagen, pisoInvisible;
var nube, nubeImagen;
const PLAY = 1;
const END = 0;
var gameState = PLAY;//El jeugo comienza jugandose
var gameOverImage, gameOver;
var trex_collided;//trex chocado
var ob1,ob2,ob3,ob4,ob5,ob6;
var reinicioImage,reinicio;
var puntos = 0
var sonidoSaltar, sonidoMorir, sonidoCheckpoint;

function preload() {//precarga, animaciones, sonidos e imagenes
//TAB tabulador
  sonidoSaltar = loadSound("jump.mp3");  
  sonidoMorir= loadSound("die.mp3");
  sonidoCheckpoint=loadSound("checkpoint.mp3");
running = loadAnimation("trex1.png", "trex3.png", "trex4.png");//paso 2 cargo la animación
  pisoImagen = loadImage("ground2.png");
  nubeImagen = loadImage("cloud.png");
  gameOverImage = loadImage("gameOver.png"); // La imagen ya esta en la memoeria del juego
 
  ob1 = loadImage("obstacle1.png");
  ob2 = loadImage("obstacle2.png");
  ob3 = loadImage("obstacle3.png");
  ob4 = loadImage("obstacle4.png");
  ob5 = loadImage("obstacle5.png");
  ob6 = loadImage("obstacle6.png");
  reinicioimage = loadImage("restart.png");
  trex_collided = loadImage("trex_collided.png");
}

function setup() {// configuración del juego
  createCanvas(600, 200);
  
  trex = createSprite(50, 160, 10, 30);
  trex.addAnimation("corriendo", running);// paso 3 pego la animación al sprite
  trex.addImage("chocado",trex_collided);
  trex.scale = 0.5;
  trex.debug = false; // Visibilidad del setcollider
  trex.setCollider("rectangle", 0,0,trex.width,trex.height); // Forma ddel colisionador

  piso = createSprite(300, 180, 600, 10);
  piso.shapeColor = "brown";
  piso.addImage(pisoImagen); // Se le pega la imagen del piso
 

  pisoInvisible = createSprite(300, 190, 600, 10);//Se crea un piso falso para que el trex camine sobre el
  pisoInvisible.visible = false;// Hago invisible el piso invisible
  
  gameOver = createSprite(300, 100, 100, 70);
  gameOver.addImage(gameOverImage);
  gameOver.scale = 0.7;
  gameOver.visible = false;


  reinicio = createSprite(300,150,100,100);
  reinicio.addImage(reinicioimage);
  reinicio.scale=0.7;//cambiar tamaño
  reinicio.visible=false;//modo invisible

  grupocactus = new Group();
  grupoNubes = new Group();
}

function draw() {//Dibujar
  background("white");
  drawSprites();
  text("score: "+ puntos,530,20);
  text(mouseX + "-"+ mouseY,mouseX,mouseY);

  if (gameState == PLAY) { // Si el estado del juego es play
    if(frameCount % 5 === 0){ // CAda 50 cuadros de animación
      puntos = puntos +1; // Suma acumulativa
    }
  
    piso.velocityX = -(4 + 3 * puntos /100); // velocidad del piso

    if(puntos > 0 && puntos %100 === 0){
      //si tengo mas de 0 puntos Y los puntos son divisibles entre 100
      sonidoCheckpoint.play();
    }
    crearNubes();//Se manda a llamar a la funcionalidad
    crearObstaculos();

    //Salto del TREX
    if (keyDown("space") && trex.y > 155) {
      trex.velocityY = -15;
      sonidoSaltar.play();
    }

    if (piso.x < 0) { //El piso llego a su fin?
      piso.x = piso.width / 2;//que el piso vuelva a salir justo en su centro
    }


    if (grupocactus.isTouching(trex)) { // Si un cactus esta tocando al trex
      //trex.velocityY = -10;
      sonidoMorir.play();
      gameState = END;
    }


  } else if (gameState == END) { // Si el estado del juego es END
    piso.velocityX = 0; // velocidad del piso a 0
    gameOver.visible = true;//aparece el menu de gameover
    reinicio.visible = true;
    grupocactus.setVelocityXEach(0);//las nubes y los obstaculos se detienen.
    grupoNubes.setVelocityXEach(0);
    grupocactus.setLifetimeEach(-1); //Cambio el tiempo de vida de los cactus
    grupoNubes.setLifetimeEach(-1);//cambio el tiempo de vida de las nubes
    //Se detiene el score o puntos
    trex.changeImage("chocado");// el trex cambia
  
    //sonido de perdiste
    if(mousePressedOver(reinicio)){
      console.log("presionando el reinicio");
      reiniciarJuego();//Mandamos a llamar a la funcionalidad
    }
  }

  trex.velocityY = trex.velocityY + 0.8; // Gravedad, jala al trex hacia el piso
  trex.collide(pisoInvisible);// el trex choca contra el piso
}

function crearNubes() { // Funcionalidad que crea nubes

  if (frameCount % 50 === 0) { //Generar nube cada 50 cuadros de animación
    var altura = Math.round(random(50, 140));// Elige la altura de la nube
    var velocidad = Math.round(random(-1, -5));
    var tam = Math.round(random(1, 0.5));

    nube = createSprite(600, altura, 30, 10);
    nube.addImage(nubeImagen);// se le pega la imagen
    nube.velocityX = velocidad; // Velocidad de la nube
    nube.scale = tam; // Tamaño de la nube
    trex.depth = nube.depth + 1;
    nube.lifetime = 650;// Tiempo de vida de las nubes en cuadros de animación
    //console.log(trex.depth);
    //console.log(nube.depth);
    grupoNubes.add(nube);
  }

}


function crearObstaculos() {
  if (frameCount % 50 === 0) {
    var cactus = createSprite(600, 170, 20, 70);

    var r = Math.round(random(1,6));
    switch (r){
      case 1:
        cactus.addImage(ob1);
        break;
      case 2:
        cactus.addImage(ob2);
        break;
      case 3:
        cactus.addImage(ob3);
        break;
      case 4:
        cactus.addImage(ob4);
        break;
      case 5:
          cactus.addImage(ob5);
          break;
      case 6:
          cactus.addImage(ob6);
          break;
    }
    cactus.velocityX = - (4 + 3 * puntos/100);
    cactus.lifetime=700;
    cactus.scale=0.7;
    grupocactus.add(cactus);
  }
}

function reiniciarJuego(){
  gameState=PLAY;// cAMBIA EEL ESTADO DEL JUEGO A play
  piso.velocityX = -(4 + 3 * puntos /100); // velocidad del piso//Piso tenga velocidad
  gameOver.visible = false;//Ocultar gameOVer
  reinicio.visible=false//Ocultar el reinicio
  grupocactus.destroyEach(); //Destruye cada uno de los cactus del grupo
  grupoNubes.destroyEach();//Deestruye cada una de las nubes
  trex.changeImage("corriendo");// el trex cambia
  puntos = 0// putnos debn reggresar a 0
}

