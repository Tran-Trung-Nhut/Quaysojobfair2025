
//Nhiều hình ảnh phóng lên => simple
export type fireWorkAttr = {
    x: number,
    y: number,
    dx: number,
    dy: number,
    life: number,
    size: number,
}

export type fireWorkStraightAttr = {
    x: number,
    y: number,
    maxY: number;
    dy: number,
    life: number,
    size: number,
    subFireWork: fireWorkAttr[]
}

export const fireWork1 = (img: HTMLImageElement, onCloseWindow: () => void, setPrizes: () => void, setPrizesShow: () => void) => {
    const canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.zIndex = "1001"
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext("2d");
    
    let particles: fireWorkAttr [] = [];

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "y") {
            onCloseWindow(); 
        }
        if(event.key === "n"){
            setPrizes()
            setPrizesShow()
            onCloseWindow()
        }
    };

    window.addEventListener("keydown", handleKeyDown);

    const createParticle = () : fireWorkAttr => {
        return {
            x: Math.random() * window.innerWidth, 
            y: 1000, 
            dx: (Math.random() - 0.5) * 6, 
            dy: -Math.random() * 7 - 5, 
            life: 100 + Math.random() * 100,
            size: 30 + Math.random() * 20, 
        }
    }

 
    for (let i = 0; i < 150; i++) {
        particles.push(createParticle());
    }

    const drawParticles = () => {
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles = particles.filter((p) => p.life > 0);
        particles.forEach((p) => {
            ctx.drawImage(img, p.x, p.y, p.size, p.size); 

            p.x += p.dx; 
            p.y += p.dy;
            p.dy += 0.05; 
            p.life--; 
        });

        if (particles.length > 0) {
            requestAnimationFrame(drawParticles);
        } else {
            document.body.removeChild(canvas);
        }
    }

    drawParticles()

    return () => {
        window.removeEventListener("keydown", handleKeyDown); 
    };
}

//Bắn vĩnh viễn không dừng
export const fireWork2 = (img: HTMLImageElement, onCloseWindow: () => void, setPrizes: () => void, setPrizesShow: () => void) => {
    let animationFrameId: number; 
    const canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.zIndex = "1001";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext("2d");
    let particlesParent: fireWorkStraightAttr[] = [];

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "y") {
            onCloseWindow(); 
            cancelAnimationFrame(animationFrameId);    
            document.body.removeChild(canvas);  
        }
        if (event.key === "n"){
            setPrizes()
            setPrizesShow()
            cancelAnimationFrame(animationFrameId);    
            document.body.removeChild(canvas);  
            onCloseWindow()
        }
    };

    window.addEventListener("keydown", handleKeyDown); 

    const createExplosionParticles = (x: number, y: number) => {
        const particles: fireWorkAttr[] = [];   
        for (let i = 0; i < 40; i++) {
            particles.push({
                x: x,
                y: y,
                dx: (Math.random() - 0.5) * 8,  
                dy: (Math.random() - 0.5) * 8,  
                life: 50 + Math.random() * 50,   
                size: 15 + Math.random() * 10,   
            });
        }
        return particles;
    };

    const createParticleParrent = () => {
        const x = Math.random() * window.innerWidth;
        const maxY = 700 - Math.random() * 400;
        return {
            x: x,
            y: 900,
            maxY: maxY,
            dy: -5 - Math.random() * 3,
            life: 100,
            size: 40,
            subFireWork: [], 
        };
    };

    for (let i = 0; i < 10; i++) {
        particlesParent.push(createParticleParrent());
    }


    const drawParticles = () => {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);  

        particlesParent.forEach((p) => {
            if (p.subFireWork.length === 0 && p.y <= p.maxY) {
                p.subFireWork = createExplosionParticles(p.x, p.y);
            }

            if (p.subFireWork.length === 0) {
                ctx.drawImage(img, p.x, p.y, p.size, p.size);
                p.y += p.dy;
                p.life--;
            }

            p.subFireWork.forEach((s) => {
                ctx.drawImage(img, s.x, s.y, s.size, s.size);
                s.x += s.dx; 
                s.y += s.dy;  
                s.life--;
            });

            p.subFireWork = p.subFireWork.filter((s) => s.life > 0);
        });

        particlesParent = particlesParent.filter((p) => p.life > 0 || p.subFireWork.length > 0);

        if (particlesParent.length > 0) {
            animationFrameId = requestAnimationFrame(drawParticles); 
        }
    };

    drawParticles();

    return () => {
        window.removeEventListener("keydown", handleKeyDown); 
        if (canvas.parentElement) {
            canvas.parentElement.removeChild(canvas);
        }
        cancelAnimationFrame(animationFrameId); 
    };
}