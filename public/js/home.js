(function(){


// 为Array对象添加乱序方法
Array.prototype.shuffle = function() {
    let newArr = [...this]
    for(var i = newArr.length; i > 0; i--){
        newArr.push(newArr.splice(Math.floor(Math.random()*i),1)[0])
    }
    return newArr;
};
let tavern = {},
    searchSubmit = document.querySelector('#search'), //搜索按钮
    searchIpt = document.querySelector('.search-bar input[name="search"]'), //搜索框
    resultList = document.querySelector('#resultList'),
    imgPathList = ['/public/img/01.jpg','/public/img/02.jpg','/public/img/03.jpg','/public/img/04.jpg'], //背景图片列表
    newimgPathList = imgPathList.shuffle(), //打乱后的列表
    weatherItemList = document.querySelectorAll('.weather-item'),
    weatherContainer = document.querySelector('.weather-container'),
    weatherTimer = {}, //天气栏定时器
    weatherLock = 0,
    toggleCity = document.querySelector('.toggle-city'), //切换城市
    citysList = document.querySelector('.citys-list'), //城市选项框
    province = document.querySelector('#province'), //省级列表select
    city = document.querySelector('#city'), //市级列表select
    submitCity = document.querySelector('#submit-city'),  //确认切换城市
    cancelCity = document.querySelector('#cancel-city'),  //取消切换城市
    cityData = {},
    // 天气接口配置
    options = {
        location: 'auto_ip',
        // location: '武汉市',
        key: '8104356a22b848f98c3a06bc105ecccf',
    };
function getCityData(){
    return new Promise((resolve,reject)=>{
        ajax({  
            url : `http://119.23.67.115:80/cityData`,  // url---->地址  
            type : "GET",   // type ---> 请求方式  
            async : true,   // async----> 同步：false，异步：true 
            data : 0,
            success : function(data){   //返回接受信息  
                    resolve(JSON.parse(data))
                }
            })
    } 
    ) 
}
function supportCanvas(){
    var Cvs = document.getElementById("myCanvas");
    if (!Cvs || !Cvs.getContext){
        return false;
    }else{
        return true;
    }
}
// 添加键盘事件
function addKeyEvent(){
    window.addEventListener('keyup',enter);
    if(resultList.children.length){
        resultList.style.display = 'block';
    }
}
// 判断是否是enter键被点击
function enter(e) {
    if(e.keyCode == 13){
        tavern.search();
    }else{
        fuzzySearch();
    }
}
// 模糊搜索
function fuzzySearch(){
    let searchUrl = 'https://www.baidu.com/su',
        keyWorld = searchIpt.value.trim();
    if(!keyWorld){
        resultList.style.display = 'none';
    }else{
        resultList.style.display = 'block';
    }
    jsonP(searchUrl + '?wd=' + keyWorld,function(data){
        resultList.innerHTML = renderResultList(data.s);
    })
    function renderResultList(arr){
        let templete = ''
        arr.forEach(function(t){
            templete += `<li><a href="https://www.baidu.com/s?ie=UTF-8&wd=${t}">${t}</a></li>`
        })
        if(!templete){
                resultList.style.display = 'none';
        }
        return templete;
    }
}
// jsonp封装
function jsonP(url,cb){
    let jsonScript = document.createElement('script'),
    timestamp = +new Date();
    jsonScript.setAttribute('src',url + '&cb=sl_' + timestamp);
    jsonScript.onload = jsonScript.onreadystatechange = function() {
        if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete" ) {
            jsonScript.parentElement.removeChild(jsonScript);
            jsonScript.onload = jsonScript.onreadystatechange = null;
        }
    };
    document.body.appendChild(jsonScript);
    window['sl_' + timestamp] = cb;
}
// 移除键盘事件
function removeKeyEvent(event){
    if(event.target != searchIpt){
        window.removeEventListener('keyup',enter);
        resultList.style.display = 'none';
    }
}
// ajax封装
function ajax(options){  
    var xhr = null;  
    var params = formsParams(options.data);  
    //创建对象  
    if(window.XMLHttpRequest){  
        xhr = new XMLHttpRequest()  
    } else {  
        xhr = new ActiveXObject("Microsoft.XMLHTTP");  
    }  
    // 连接  
    if(options.type == "GET"){  
        xhr.open(options.type,options.url + "?"+ params,options.async);  
        xhr.send(null)
    } else if(options.type == "POST"){  
        xhr.open(options.type,options.url,options.async);  
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");  
        xhr.send(params);  
    }  
    xhr.onreadystatechange = function(){  
        if(xhr.readyState == 4 && xhr.status == 200){  
            options.success(xhr.responseText);  
        }  
    }  
    function formsParams(data){  
        var arr = [];  
        for(var prop in data){  
            arr.push(prop + "=" + data[prop]);  
        }  
        return arr.join("&");  
    }  
}  
// 搜索函数
tavern.search = () => {
    let searchUrl = 'https://www.baidu.com/s?ie=UTF-8&wd=',
        keyWorld = searchIpt.value.trim();
    if(keyWorld !== ''){
        location.href = searchUrl +keyWorld;
    }
}
// 添加搜索按钮点击事件
searchSubmit.addEventListener('click',()=>{
    tavern.search();
})
// 绑定输入框焦点事件
searchIpt.addEventListener('focus',addKeyEvent);
document.body.addEventListener('click',removeKeyEvent);
tavern.replaceBackground = function(){
    let index = 0;
    document.body.style.backgroundImage = `url(${newimgPathList[index++]})`;
    setInterval(()=>{
        document.body.style.background = `url(${newimgPathList[index]})`;
        index >= newimgPathList.length - 1 ? index = 0 : index++;
    },10000);
}
// 缓存图片
tavern.loadImg = function(){
    let imgList = [];
    imgPathList.forEach((item)=>{
        let img = new Image();
        img.src = item;
        imgList.push(img);
    })
    return imgList;
}

var imgList = tavern.loadImg();

tavern.getWeather = function(){
    let cache_date = 43200000; //缓存时间(毫秒)
    // 判断是否使用缓存 
    if(window.localStorage && new Date() - window.localStorage['weatherTimestamp'] < cache_date && window.localStorage['weather']){
        let data = JSON.parse(window.localStorage['weather']);
        tavern.updataWeather(data);
        console.log('现在使用的是缓存');
    }else{
        ajax({  
        url : `https://free-api.heweather.com/s6/weather/forecast`,  // url---->地址  
        type : "GET",   // type ---> 请求方式  
        async : true,   // async----> 同步：false，异步：true   
        // data : {        //传入信息  
        //     name : "张三",  
        //     age : 18  
        // }, 
        data : options,
        success : function(data){   //返回接受信息  
                let _data = JSON.parse(data)
                tavern.updataWeather(_data);
                console.log('天气数据已更新')
                if(window.localStorage){
                    let storage = window.localStorage;
                    storage['weather'] = data;
                    storage['weatherTimestamp'] = +new Date();
                    console.log('缓存成功');
                }
            }  
        })
    }
}
tavern.updataWeather = function(data){     
    let content = data.HeWeather6[0],
        daily = content.daily_forecast;
    // 更新城市
    function updataCity(){
        document.querySelector('.weather-container h3').innerText = content.basic.admin_area + ' ' + content.basic.location;
    }
    // 更新天气模块
    function updataWeatherItem(target,index) {
        target.children[0].innerText = daily[index].date; //日期
        updataWeatherImage(target.children[1].children[0],daily[index].cond_code_d); //图片
        target.children[2].innerText = `${daily[index].tmp_min}到${daily[index].tmp_max}摄氏度`; //温度
        target.children[3].innerText = daily[index].wind_dir; //风向
        target.children[4].innerText = `风力:${daily[index].wind_sc}级`; //风力
    }
    // 更新天气图片
    function updataWeatherImage(target,weather_code){
        // 天气代码
        let weatherCode = {
            100:{
                c: '晴',
                site: [0,0]
            },
            101:{
                c: '多云',
                site: [0,1]
            },
            102:{
                c: '少云',
                site: [0,1]
            },
            103:{
                c: '晴间多云',
                site: [0,1]
            },
            104:{
                c: '阴',
                site: [0,2]
            },
            200:{
                c: '有风',
                site: [3,0]
            },
            201:{
                c: '平静',
                site: [3,0]
            },
            202:{
                c: '微风',
                site: [3,0]
            },
            203:{
                c: '和风',
                site: [3,0]
            },
            204:{
                c: '清风',
                site: [3,0]
            },
            205:{
                c: '强风/劲风',
                site: [3,0]
            },
            206:{
                c: '疾风',
                site: [3,0]
            },
            207:{
                c: '大风',
                site: [3,0]
            },
            208:{
                c: '烈风',
                site: [3,0]
            },
            209:{
                c: '风暴',
                site: [3,0]
            },
            210:{
                c: '狂爆风',
                site: [3,0]
            },
            211:{
                c: '飓风',
                site: [3,0]
            },
            212:{
                c: '龙卷风',
                site: [3,0]
            },
            213:{
                c: '热带风暴',
                site: [3,0]
            },
            300:{
                c: '阵雨',
                site: [2,0]
            },
            301:{
                c: '强阵雨',
                site: [2,0]
            },
            302:{
                c: '雷阵雨',
                site: [2,0]
            },
            303:{
                c: '强雷阵雨',
                site: [2,0]
            },
            304:{
                c: '雷阵雨伴有冰雹',
                site: [2,0]
            },
            305:{
                c: '小雨',
                site: [1,0]
            },
            306:{
                c: '中雨',
                site: [1,1]
            },
            307:{
                c: '大雨',
                site: [1,2]
            },
            308:{
                c: '极端降雨',
                site: [1,2]
            },
            309:{
                c: '毛毛雨/细雨',
                site: [1,0]
            },
            310:{
                c: '暴雨',
                site: [1,2]
            },
            311:{
                c: '大暴雨',
                site: [1,2]
            },
            312:{
                c: '热带风暴',
                site: [1,2]
            },
            313:{
                c: '特大暴雨',
                site: [1,2]
            },
            314:{
                c: '冻雨',
                site: [1,2]
            },
            315:{
                c: '中到大雨',
                site: [1,2]
            },
            316:{
                c: '大到暴雨',
                site: [1,2]
            },
            317:{
                c: '暴雨到大暴雨',
                site: [1,2]
            },
            318:{
                c: '大暴雨到特大暴雨',
                site: [1,2]
            },
            399:{
                c: '雨',
                site: [1,2]
            },
            400:{
                c: '小雪',
                site: [2,2]
            },
            401:{
                c: '中雪',
                site: [2,2]
            },
            402:{
                c: '大雪',
                site: [2,2]
            },
            403:{
                c: '暴雪',
                site: [2,2]
            },
            404:{
                c: '雨夹雪',
                site: [2,1]
            },
            405:{
                c: '雨雪天气',
                site: [2,0]
            },
            406:{
                c: '阵雨夹雪',
                site: [2,1]
            },
            407:{
                c: '阵雪',
                site: [2,0]
            },
            408:{
                c: '小到中雪',
                site: [2,2]
            },
            409:{
                c: '中到大雪',
                site: [2,2]
            },
            410:{
                c: '大到暴雪',
                site: [2,2]
            },
            499:{
                c: '雪',
                site: [2,2]
            },
            500:{
                c: '薄雾',
                site: [3,2]
            },
            501:{
                c: '雾',
                site: [3,2]
            },
            502:{
                c: '霾',
                site: [3,2]
            },
            503:{
                c: '扬沙',
                site: [3,2]
            },
            504:{
                c: '浮尘',
                site: [3,2]
            },
            507:{
                c: '沙尘暴',
                site: [3,2]
            },
            508:{
                c: '强沙尘暴',
                site: [3,2]
            },
            509:{
                c: '浓雾',
                site: [3,2]
            },
            510:{
                c: '强浓雾',
                site: [3,2]
            },
            511:{
                c: '中度霾',
                site: [3,2]
            },
            512:{
                c: '重度霾',
                site: [3,2]
            },
            513:{
                c: '严重霾',
                site: [3,2]
            },
            514:{
                c: '大雾',
                site: [3,2]
            },
            515:{
                c: '特强浓雾',
                site: [3,2]
            }
        },
        w = 142, //单个图片宽度
        h = 142; //单个图片高度
        // 异常天气代码报错
        try{
            let site = weatherCode[weather_code].site;
            target.style.backgroundPosition = `${-site[1] * w}px ${-site[0] * h}px`
        }
        catch(err){
            target.innerText = '数据异常'
        }
    }
    switch(content.status){
        case 'ok':
            updataCity();
            weatherItemList.forEach(updataWeatherItem);
            break;
        case 'invalid key':
            weatherContainer.innerText = '错误的key，请检查你的key是否输入以及是否输入有误';
            break;
        case 'unknown location':
            weatherContainer.innerText = '未知或错误城市/地区';
            break;
        case 'no data for this location':
            weatherContainer.innerText = '该城市/地区没有你所请求的数据';
            break;
        case 'no more requests':
            weatherContainer.innerText = '超过访问次数';
            break;
        case 'param invalid':
            weatherContainer.innerText = '参数错误';
            break;
        case 'too fast':
            weatherContainer.innerText = '超过限定的访问次数';
            break;
        case 'dead':
            weatherContainer.innerText = '无响应或超时，接口服务异常';
            break;
        case 'permission denied':
            weatherContainer.innerText = '无访问权限，你没有购买你所访问的这部分服务';
            break;
        default:
            weatherContainer.innerText = '数据异常';
            break
    }
}
tavern.getWeather();
// 添加天气栏控制器事件
document.querySelector('.weather-control').addEventListener('click',function(){
    weatherContainer.classList.toggle('weather-container-show');
    // if(!weatherLock){
    //     weatherLock = 1;
    //     weatherTimer = setTimeout(function(){
    //         weatherContainer.classList.remove('weather-container-show');
    //         weatherLock = 0;
    //     },10000)
    // }else{
    //     clearTimeout(weatherTimer);
    //     weatherLock = 0;
    // }
});
weatherContainer.addEventListener('mouseleave',function(){
    weatherTimer = setTimeout(function(){
            weatherContainer.classList.remove('weather-container-show');
            // weatherLock = 0;
        },5000)
});
weatherContainer.addEventListener('mouseover',function(){
    clearTimeout(weatherTimer);
    //     weatherLock = 0;
});
// 切换城市
toggleCity.addEventListener('click',function(e){
    cityData = getCityData();
    cityData.then(function(data){
        
        let provinces = data.provinces, //省份数据
        provincesOptions = '', //省份列表
        citysOptions = '';  //市列表
// 绑定选项框更改事件
console.log(typeof data)
province.addEventListener('change',function(){
    citysOptions = getOptions(provinces[this.selectedIndex].citys,'citysName');
    city.innerHTML = citysOptions;
})
// 获取初始省市渲染字符串
provincesOptions = getOptions(provinces,'provinceName');
citysOptions = getOptions(provinces[0].citys,'citysName');
// 渲染字符串
province.innerHTML = provincesOptions;
city.innerHTML = citysOptions;
// 显示城市选项框
citysList.classList.add('citys-list-show');
    })

    //返回列表渲染字符串 arg1：列表；arg2：关键字key 
    function getOptions(list,target){
        let options = '';
        list.forEach((item,index)=>{
            options += `<option value=${item[target]}>${item[target]}</option>`;
        });
        return options;
    }

    
});
// 绑定取消按钮
cancelCity.addEventListener('click',function(){
    citysList.classList.remove('citys-list-show');
})
// 绑定确定按钮
submitCity.addEventListener('click',function () {
    // 更改设置
    options.location = city.value;
    // 置零时间戳避免使用缓存
    if(window.localStorage){
        window.localStorage.setItem('weatherTimestamp',0);
    }
    // 获取天气信息
    tavern.getWeather();
    // 隐藏城市选项框
    citysList.classList.remove('citys-list-show');
})

window.onload = function () {
    // 更换背景图片
    if(supportCanvas()){
        const dh = new BgTransition({imgList : imgList});
    }else{
        tavern.replaceBackground();
    }
}
})();
