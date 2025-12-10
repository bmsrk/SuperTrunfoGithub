import { CombinedProfile } from '../types';

// Helper to load image
const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = (e) => reject(e);
        img.src = src;
    });
};

export const renderCardToCanvas = async (data: CombinedProfile): Promise<string> => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    // High resolution canvas
    const scale = 2;
    const width = 340 * scale;
    // Calculation:
    // Header(40) + Image(320 - Square) + Name(50) + Stats(4*26=104) + Ability(85) + Borders(~20) = ~619 -> 630 rounded
    const height = 630 * scale; 
    
    canvas.width = width;
    canvas.height = height;
    ctx.scale(scale, scale);

    const { user, cardData, aiImageUrl } = data;

    // 1. Main Background
    const gradient = ctx.createLinearGradient(0, 0, 340, 630);
    gradient.addColorStop(0, '#171717');
    gradient.addColorStop(1, '#0a0a0a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 340, 630);
    
    // 2. Card Container (White part)
    ctx.fillStyle = '#ffffff';
    ctx.roundRect(10, 10, 320, 610, 8);
    ctx.fill();

    // 3. Header
    ctx.fillStyle = '#171717'; 
    ctx.fillRect(10, 10, 320, 40);
    
    // Header Text -> User Login (Username)
    ctx.font = 'bold 18px "Chakra Petch", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(user.login.toUpperCase(), 24, 36);

    // Super Trunfo Badge
    ctx.save();
    ctx.translate(220, 15);
    ctx.transform(1, 0, -0.2, 1, 0, 0); 
    ctx.fillStyle = '#eab308'; // Yellow 500
    ctx.fillRect(0, 0, 100, 18);
    ctx.restore();
    
    ctx.font = '900 9px sans-serif';
    ctx.fillStyle = '#000000';
    ctx.fillText('SUPER TRUNFO', 230, 27);

    // 4. Image (Square 1:1 Ratio)
    // Width 320. Height = 320.
    const imageHeight = 320; 
    const imageY = 50;

    try {
        const imgUrl = aiImageUrl || user.avatar_url;
        const avatar = await loadImage(imgUrl);
        
        // Clip
        ctx.save();
        ctx.beginPath();
        ctx.rect(10, imageY, 320, imageHeight);
        ctx.clip();
        
        // Draw Image (Cover)
        const imgRatio = avatar.width / avatar.height;
        // Target is square (1:1), so containerRatio is 1
        const containerRatio = 1;
        let drawW, drawH, drawX, drawY;

        if (imgRatio > containerRatio) {
            // Image is wider than tall (Landscape)
            drawH = imageHeight;
            drawW = imageHeight * imgRatio;
            drawX = 10 + (320 - drawW) / 2;
            drawY = imageY;
        } else {
            // Image is taller than wide (Portrait)
            drawW = 320;
            drawH = 320 / imgRatio;
            drawX = 10;
            drawY = imageY + (imageHeight - drawH) / 2;
        }
        
        ctx.drawImage(avatar, drawX, drawY, drawW, drawH);
        
        // Shadow Gradient
        const overlay = ctx.createLinearGradient(0, imageY + imageHeight - 100, 0, imageY + imageHeight);
        overlay.addColorStop(0, 'rgba(23,23,23,0)');
        overlay.addColorStop(1, 'rgba(23,23,23,0.9)');
        ctx.fillStyle = overlay;
        ctx.fillRect(10, imageY, 320, imageHeight);
        ctx.restore();

        // Archetype Badge
        ctx.save();
        ctx.translate(20, imageY + imageHeight - 32);
        ctx.transform(1, 0, -0.1, 1, 0, 0);
        ctx.fillStyle = '#facc15'; 
        ctx.shadowColor = 'rgba(0,0,0,0.6)';
        ctx.shadowBlur = 4;
        ctx.fillRect(0, 0, 180, 24); 
        ctx.restore();

        ctx.font = 'bold 12px "Chakra Petch", sans-serif';
        ctx.fillStyle = '#000000';
        ctx.fillText(cardData.archetype, 28, imageY + imageHeight - 16);

    } catch (e) {
        ctx.fillStyle = '#333';
        ctx.fillRect(10, imageY, 320, imageHeight);
    }

    let currentY = imageY + imageHeight;

    // 5. Name Section (Full Name)
    ctx.fillStyle = '#171717';
    ctx.fillRect(10, currentY, 320, 50);
    
    ctx.textAlign = 'center';
    ctx.font = '900 20px "Chakra Petch", sans-serif';
    ctx.fillStyle = '#ffffff';
    
    // Use user.name (Full Name), fallback to login if empty
    const displayName = (user.name || user.login).toUpperCase();
    ctx.fillText(displayName, 170, currentY + 28);

    ctx.font = 'italic 9px sans-serif';
    ctx.fillStyle = '#9ca3af'; 
    ctx.fillText(`"${cardData.description}"`, 170, currentY + 42);

    currentY += 50;

    // 6. Stats
    ctx.textAlign = 'left';
    
    // We expect exactly 4 stats now, but iterate safely
    cardData.stats.forEach((stat, index) => {
        const isOdd = index % 2 !== 0;
        ctx.fillStyle = isOdd ? '#ffffff' : '#f9fafb';
        ctx.fillRect(10, currentY, 320, 26);

        // Label
        ctx.font = 'bold 10px "Chakra Petch", sans-serif';
        ctx.fillStyle = '#4b5563';
        ctx.fillText(stat.label.toUpperCase(), 30, currentY + 17);

        // Value
        const isTrunfo = cardData.superTrunfoAttribute === stat.label;
        
        ctx.textAlign = 'right';
        ctx.font = '900 13px monospace';
        ctx.fillStyle = isTrunfo ? '#d97706' : '#171717'; 
        ctx.fillText(`${stat.value}${stat.unit || ''}`, 310, currentY + 18);

        if (isTrunfo) {
            ctx.font = 'bold 9px sans-serif';
            ctx.fillStyle = '#eab308';
            ctx.fillText('TRUNFO', 260, currentY + 17);
        }

        ctx.textAlign = 'left';
        currentY += 26;
    });

    // 7. Special Ability
    const remainingHeight = 620 - 10 - currentY;
    ctx.fillStyle = '#171717';
    ctx.fillRect(10, currentY, 320, remainingHeight); 
    
    // Border top
    ctx.fillStyle = '#eab308';
    ctx.fillRect(10, currentY, 320, 4);

    // Title
    ctx.font = 'bold 12px "Chakra Petch", sans-serif';
    ctx.fillStyle = '#facc15';
    ctx.fillText(cardData.specialAbility.name.toUpperCase(), 40, currentY + 24);

    // Icon
    ctx.fillStyle = '#eab308';
    ctx.fillRect(20, currentY + 12, 14, 14);

    // Desc
    ctx.font = '9px monospace';
    ctx.fillStyle = '#d1d5db'; 
    
    const desc = cardData.specialAbility.description;
    const line1 = desc.substring(0, 60);
    const line2 = desc.length > 60 ? desc.substring(60, 120) : '';
    
    ctx.fillText(line1, 30, currentY + 42);
    if(line2) {
         ctx.fillText(line2 + (desc.length > 120 ? '...' : ''), 30, currentY + 54);
    }

    return canvas.toDataURL('image/png');
};