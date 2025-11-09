const config = {
    "certificate": {
        "width": 1637,
        "height": 1157,
        
        "content": {
            "title": "AE TIPS QUEST",
            "subtitle": "Сертификат успеха",
            "userName": "[USER_NAME]",
            "achievement": "Успешно пройденый квест",
            "date": "[CURRENT_DATE]",
            "rank": "Expression Guru",
            "signature": "Подпись: AE Tips"
        },
        
        "styles": {
            "title": { "font": "bold 35px 'Ubuntu Mono', monospace", "y": 100 },
            "subtitle": { "font": "bold 35px 'Ubuntu Mono', monospace", "y": 137 },
            "userName": { "font": "bold 35px 'Ubuntu Mono', monospace", "y": 174 },
            "achievement": { "font": "bold 35px 'Ubuntu Mono', monospace", "y": 211 },
            "date": { "font": "bold 35px 'Ubuntu Mono', monospace", "y": 248 },
            "rank": { "font": "bold 35px 'Ubuntu Mono', monospace", "y": 285 },
            "signature": { "font": "bold 35px 'Ubuntu Mono', monospace", "y": 322 }
        }
    }
};

let currentUserName = '';
let isCanvasReady = false;

function generateCertificate() {
    const userName = document.getElementById('userName').value.trim();
    
    if (!userName) {
        alert('Введи своё имя!');
        return;
    }
    
    currentUserName = userName;
    isCanvasReady = false;
    
    const canvas = document.getElementById('certificateCanvas');
    const ctx = canvas.getContext('2d');
    const certConfig = config.certificate;
    
    canvas.width = certConfig.width;
    canvas.height = certConfig.height;
    
    // Очищаем canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Используем только программный фон
    drawCertificateBackground(ctx, canvas.width, canvas.height);
    drawJSONCertificate(ctx, userName, canvas.width, certConfig);
    document.getElementById('certificateContainer').classList.remove('hidden');
    isCanvasReady = true;
}

function drawCertificateBackground(ctx, width, height) {
    // Темный градиентный фон
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#0a0a0a');
    gradient.addColorStop(1, '#1a1a2e');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Только сетка как в редакторе кода
    ctx.strokeStyle = '#2a2a3a';
    ctx.lineWidth = 1;
    
    // Вертикальные линии
    for (let x = 0; x < width; x += 25) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }
    
    // Горизонтальные линии
    for (let y = 0; y < height; y += 25) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }
}

function drawJSONCertificate(ctx, userName, canvasWidth, certConfig) {
    const content = certConfig.content;
    const styles = certConfig.styles;
    const currentDate = new Date().toLocaleDateString('ru-RU');
    
    function drawJSONLine(key, value, style, isLast = false) {
        const x = 100;
        const y = style.y;
        const comma = isLast ? '' : ',';
        
        // Ключ - СИНИЙ
        ctx.fillStyle = '#3498db';
        ctx.font = style.font;
        ctx.textAlign = 'left';
        ctx.fillText(`"${key}": `, x, y);
        
        // Измеряем ширину ключа для позиционирования значения
        const keyWidth = ctx.measureText(`"${key}": `).width;
        
        // Значение - ЗЕЛЕНОЕ
        ctx.fillStyle = '#2ecc71';
        
        let displayValue = value;
        
        if (key === 'userName') {
            displayValue = userName;
        } else if (key === 'date') {
            displayValue = currentDate;
        }
        
        const valueText = typeof displayValue === 'string' && !displayValue.includes('[') ? 
            `"${displayValue}"` : displayValue;
        ctx.fillText(`${valueText}${comma}`, x + keyWidth, y);
    }
    
    // Открывающая фигурная скобка - БЕЛАЯ
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 35px "Ubuntu Mono", monospace';
    ctx.fillText('{', 50, 80);
    
    // Рисуем все строки
    const keys = Object.keys(content);
    keys.forEach((key, index) => {
        const isLast = index === keys.length - 1;
        drawJSONLine(key, content[key], styles[key], isLast);
    });
    
    // Закрывающая фигурная скобка - БЕЛАЯ
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 35px "Ubuntu Mono", monospace';
    ctx.fillText('}', 50, styles.signature.y + 40);
}

function downloadPNG() {
    if (!isCanvasReady) {
        alert('Сначала создай сертификат!');
        return;
    }
    
    const canvas = document.getElementById('certificateCanvas');
    
    try {
        // Простой и надежный способ
        const image = canvas.toDataURL('image/png');
        const fileName = currentUserName ? `ae-tips-${currentUserName}.png` : 'ae-tips-certificate.png';
        
        // Создаем временную ссылку
        const tmpLink = document.createElement('a');
        tmpLink.download = fileName;
        tmpLink.href = image;
        
        // Добавляем на страницу, кликаем и удаляем
        document.body.appendChild(tmpLink);
        tmpLink.click();
        document.body.removeChild(tmpLink);
        
    } catch (error) {
        console.error('Ошибка скачивания:', error);
        
        // Последний резервный вариант
        const image = canvas.toDataURL('image/png');
        const newWindow = window.open('');
        newWindow.document.write(`
            <html>
                <head><title>Сертификат</title></head>
                <body style="margin: 0; background: #1a1a1a; display: flex; justify-content: center; align-items: center; height: 100vh;">
                    <img src="${image}" style="max-width: 90%; max-height: 90%; border: 2px solid #3498db;" />
                    <p style="color: white; text-align: center;">Нажми правой кнопкой → Сохранить изображение как</p>
                </body>
            </html>
        `);
    }
}

document.getElementById('userName').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        generateCertificate();
    }
});
