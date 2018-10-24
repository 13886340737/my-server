   var BgTransition = function (paramas){
        var defaults = {
            el : '#myCanvas',
            imgW : 1920,
            imgH : 1080,  //原始图像尺寸
            cvW : 1920,
            cvH : 1080,   //画布尺寸
            dw : 30,
            dh : 30,   //设置画布单元格尺寸
            animateType : 'random'
        },
            _paramas = Object.assign(defaults,paramas),
            contRow = _paramas.cvH / _paramas.dh,    //行数
            contCol = _paramas.cvW / _paramas.dw,    //列数
            oDw = _paramas.imgW / contCol,
            oDh = _paramas.imgH / contRow,   //原图单元格宽高
            canvas= document.querySelector(_paramas.el),
            ctx = canvas.getContext('2d'),
            imgList = _paramas.imgList,
            index = 0,
            img = imgList[index],
            timer = {};
        Object.assign(this,_paramas);
        function init(){
            show(img,'rollX');
            startAnimate();
        }
        init();
        function startAnimate(){
            if(timer){
                clearInterval(timer);
            }
            timer = setInterval(function(){
                let animateType = ['rollY','rollX','rollY_f','rollX_f'],
                    animate = '';
                if(_paramas.animateType === 'random'){
                    animate = animateType[Math.floor(Math.random()*animateType.length)];
                }else{
                    animate = _paramas.animateType;
                }
                show(img,animate);
                nextImg();
            },5000)
        }
        function stopAnimate(){
            if(timer){
                clearInterval(timer);
            }
        }
        function nextImg(){
            if(index >= imgList.length - 1){
                index = 0;
            }else{
                index++;
            }
            img = imgList[index];
        }
        function rending(img,i,j){
            ctx.drawImage(img, oDw * i, oDh * j, oDw, oDh, _paramas.dw*i, _paramas.dh*j, _paramas.dw, _paramas.dh);
        }
        function show(img,type){
            let dType = type || '';
            function rollX(){
                    let i = 0;
                    function animate(){
                        for(let j = 0;j<contRow;j++){
                            rending(img,i,j);
                        }
                        if(i >= contCol){
                            return;
                        }
                        i++
                        requestAnimationFrame(animate);
                    }
                    requestAnimationFrame(animate);
                }
            function rollY(){
                    let j = 0;
                    function animate(){
                        for(let i = 0;i<contCol;i++){
                            rending(img,i,j);
                        }
                        if(j >= contRow){
                            return
                        }
                        j++
                        requestAnimationFrame(animate);
                    }
                    requestAnimationFrame(animate);
                }
            function rollX_f(){
                    let i = contCol - 1;
                    function animate(){
                        for(let j = 0;j<contRow;j++){
                            rending(img,i,j);
                        }
                        if(i <= 0){
                            return
                        }
                        i--
                        requestAnimationFrame(animate);
                    }
                    requestAnimationFrame(animate);
                }
            function rollY_f(){
                    let j = contRow - 1;
                    function animate(){
                        for(let i = 0;i<contCol;i++){
                            rending(img,i,j);
                        }
                        if(j <= 0){
                            return
                        }
                        j--
                        requestAnimationFrame(animate);
                    }
                    requestAnimationFrame(animate);
                }
            switch (dType) {
                    case 'rollX':
                        rollX();
                        break;
                    case 'rollY':
                        rollY();
                        break;
                    case 'rollX_f':
                        rollX_f();
                        break;
                    case 'rollY_f':
                        rollY_f();
                        break;
                    default:
                        rollY();
                        break;
                }
        }
        document.addEventListener('visibilitychange', function() {
            if (!document.hidden) {
                // 进入code
                // console.log('进入')
                startAnimate();
            }else {
                // console.log('移出')
                stopAnimate();
            }
        })
    }
