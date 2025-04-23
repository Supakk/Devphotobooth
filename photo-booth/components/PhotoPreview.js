const applyFilter = (ctx, filterId) => {
    const canvas = canvasRef.current;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // ประยุกต์ใช้ฟิลเตอร์ต่างๆ
    if (filterId === 'grayscale') {
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg;     // R
        data[i + 1] = avg; // G
        data[i + 2] = avg; // B
      }
    } else if (filterId === 'sepia') {
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
        data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
        data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
      }
    } else if (filterId === 'blur') {
      // Simple blur implementation (average with neighboring pixels)
      const copy = new Uint8ClampedArray(data);
      const width = canvas.width;
      const height = canvas.height;
      
      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          const idx = (y * width + x) * 4;
          
          // Average R, G, B channels with 8 neighboring pixels
          for (let c = 0; c < 3; c++) {
            let sum = 0;
            sum += copy[idx - width * 4 - 4 + c]; // top left
            sum += copy[idx - width * 4 + c];     // top
            sum += copy[idx - width * 4 + 4 + c]; // top right
            sum += copy[idx - 4 + c];             // left
            sum += copy[idx + c];                 // center
            sum += copy[idx + 4 + c];             // right
            sum += copy[idx + width * 4 - 4 + c]; // bottom left
            sum += copy[idx + width * 4 + c];     // bottom
            sum += copy[idx + width * 4 + 4 + c]; // bottom right
            
            data[idx + c] = sum / 9;
          }
        }
      }
    } else if (filterId === 'contrast') {
      const factor = 1.25; // Increase contrast by 25%
      const intercept = 128 * (1 - factor);
      
      for (let i = 0; i < data.length; i += 4) {
        data[i] = data[i] * factor + intercept;
        data[i + 1] = data[i + 1] * factor + intercept;
        data[i + 2] = data[i + 2] * factor + intercept;
      }
    } else if (filterId === 'brightness') {
      const brightnessFactor = 30; // Increase brightness
      
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, data[i] + brightnessFactor);
        data[i + 1] = Math.min(255, data[i + 1] + brightnessFactor);
        data[i + 2] = Math.min(255, data[i + 2] + brightnessFactor);
      }
    } else if (filterId === 'hue-rotate') {
      for (let i = 0; i < data.length; i += 4) {
        // Convert RGB to HSL
        const r = data[i] / 255;
        const g = data[i + 1] / 255;
        const b = data[i + 2] / 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        
        if (max === min) {
          h = s = 0; // achromatic
        } else {
          const d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          
          switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
          }
          
          h /= 6;
        }
        
        // Modify hue (rotate by 60 degrees = 0.167)
        h = (h + 0.167) % 1;
        
        // Convert back to RGB
        const hueToRgb = (p, q, t) => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1/6) return p + (q - p) * 6 * t;
          if (t < 1/2) return q;
          if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
          return p;
        };
        
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        
        data[i] = Math.round(hueToRgb(p, q, h + 1/3) * 255);
        data[i + 1] = Math.round(hueToRgb(p, q, h) * 255);
        data[i + 2] = Math.round(hueToRgb(p, q, h - 1/3) * 255);
      }
    } else if (filterId === 'invert') {
      for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i];
        data[i + 1] = 255 - data[i + 1];
        data[i + 2] = 255 - data[i + 2];
      }
    }
    
    // นำข้อมูลภาพที่แก้ไขแล้วกลับไปใส่ใน canvas
    ctx.putImageData(imageData, 0, 0);
  };