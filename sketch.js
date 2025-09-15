
let video;
let targetColor;
let flowers = [];
let bloomParticles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);

  // 后置摄像头设置
  let constraints = {
    video: {
      facingMode: { exact: "environment" }
    },
    audio: false
  };

  video = createCapture(constraints, () => {
    console.log("📷 后置摄像头已启动");
  });

  video.size(width, height);
  video.hide();
  targetColor = color(255, 255, 0); // 黄色
}

function draw() {
  background(0);
  image(video, 0, 0, width, height);
  video.loadPixels();

  flowers = [];

  for (let y = 0; y < video.height; y += 10) {
    for (let x = 0; x < video.width; x += 10) {
      let index = (x + y * video.width) * 4;
      let r = video.pixels[index];
      let g = video.pixels[index + 1];
      let b = video.pixels[index + 2];

      // 判断颜色接近“亮黄”
      let d = dist(r, g, b, 255, 255, 0);
      if (d < 80 && r > 200 && g > 200 && b < 100) {
        let screenX = map(x, 0, video.width, 0, width);
        let screenY = map(y, 0, video.height, 0, height);
        flowers.push({ x: screenX, y: screenY, size: 80 });
      }
    }
  }

  // 绘制小花
  for (let f of flowers) {
    drawFlower(f.x, f.y, f.size);
  }

  // 绘制绽放动画粒子
  for (let i = bloomParticles.length - 1; i >= 0; i--) {
    let p = bloomParticles[i];
    p.update();
    p.show();
    if (p.isFinished()) {
      bloomParticles.splice(i, 1);
    }
  }
}

function drawFlower(x, y, size) {
  push();
  translate(x, y);
  noStroke();
  fill(255, 204, 0);
  for (let i = 0; i < 8; i++) {
    ellipse(0, size / 2, size, size / 2);
    rotate(PI / 4);
  }
  fill(255, 150, 0);
  ellipse(0, 0, size * 0.5);
  pop();
}

function mousePressed() {
  // 点击屏幕触发绽放动画
  for (let i = 0; i < 10; i++) {
    bloomParticles.push(new BloomParticle(mouseX, mouseY));
  }
}

// 粒子类（花瓣扩散效果）
class BloomParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = random(10, 20);
    this.angle = random(TWO_PI);
    this.speed = random(2, 5);
    this.alpha = 255;
  }

  update() {
    this.x += cos(this.angle) * this.speed;
    this.y += sin(this.angle) * this.speed;
    this.alpha -= 5;
  }

  show() {
    noStroke();
    fill(255, 204, 0, this.alpha);
    ellipse(this.x, this.y, this.r);
  }

  isFinished() {
    return this.alpha <= 0;
  }
}
