const $= document.querySelector.bind(document);
const $$= document.querySelectorAll.bind(document);
const PLAYER_STORAGE_KEY='F8_PLAYER';
const playList=$('.play_list');
const player= $('.player');
const cd= $('.cd');
const heading= $('header h2');
const cdImage= $('.cd_image');
const audio= $('#audio'); 
const playBtn= $('.playbtn');
const progress= $('#progress');
const nextBtn= $('.next_list');
const prevBtn= $('.prevous_list');
const randomBtn= $('.rand_list');
const repeatBtn= $('.repeat_list');
const app={
  oldArrayIndex:[],
  isRepeat: false,
  isPlaying: false,
  isRandom: false,
  currentIndex: 0,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY))||{},
  songs:[
    {
      name: 'Nevada',
      singer:'Vicetone',
      path:'/hocjs/list_music/mp3/mp3_1.mp3',
      image: '/hocjs/list_music/img/img_1.jpg'
    },
    {
      name: 'Summertime',
      singer:'K-391',
      path:'/hocjs/list_music/mp3/mp3_2.mp3',
      image: '/hocjs/list_music/img/img_2.jpg'
    },
    {
      name: ' Ngày Khác Lạ',
      singer:'Đen',
      path:'/hocjs/list_music/mp3/mp3_3.mp3',
      image: '/hocjs/list_music/img/img_3.jpg'
    },
    {
      name: 'Bước qua mùa cô đơn',
      singer:'Vũ',
      path:'/hocjs/list_music/mp3/mp3_4.mp3',
      image: '/hocjs/list_music/img/img_4.jpg'
    },
    {
      name: 'Nếu lúc trước em đừng tới',
      singer:'Khải Đăng',
      path:'/hocjs/list_music/mp3/mp3_5.mp3',
      image: '/hocjs/list_music/img/img_5.jpg'
    },
    {
      name: 'Tệ thật, anh nhớ em',
      singer:'Thanh Hưng',
      path:'/hocjs/list_music/mp3/mp3_6.mp3',
      image: '/hocjs/list_music/img/img_6.jpg'
    },
    {
      name: 'Xa em',
      singer:'noo Phước Thịnh',
      path:'/hocjs/list_music/mp3/mp3_7.mp3',
      image: '/hocjs/list_music/img/img_7.jpg'
    },
    {
      name: 'Bao tiền một mớ bình yên',
      singer:'14 Casper&Bon',
      path:'/hocjs/list_music/mp3/mp3_8.mp3',
      image: '/hocjs/list_music/img/img_8.jpg'
    },
    {
      name: 'Lạc nhau có phải muôn đời',
      singer:'ERIK from ST.319',
      path:'/hocjs/list_music/mp3/mp3_9.mp3',
      image: '/hocjs/list_music/img/img_9.jpg'
    },
  ],
  setConfig: function(key,value){
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY,JSON.stringify(this.config));
  },
  render: function(){
    let htmls= this.songs.map((song,index)=>{
      return `
      <div class="song ${index===this.currentIndex?'active':''}" data-index="${index}">
        <div class="image_song" style="background-image: url('${song.image}')"></div>
        <div class="body_list">
          <h3 class="title">${song.name}</h3>
          <p class="author">${song.singer}</p>
        </div>
        <div class="option">
          <i class="fa-solid fa-ellipsis"></i>
        </div>
      </div>
      `
    });
    $('.play_list').innerHTML=htmls.join('');
  },
  definedProperties: function(){
    Object.defineProperty(this,"currentSong",{
      get: function(){
        return this.songs[this.currentIndex];
      }
    });
  },
  loadCurrentSong: function(){
    heading.textContent = this.currentSong.name;
    cdImage.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src= this.currentSong.path;
  },
  loadConfig: function(){
    this.isRandom=this.config.isRandom;
    this.isRepeat=this.config.isRepeat;
  },
  nextSong: function(){
    this.currentIndex++;
    if(this.currentIndex>=this.songs.length){
      this.currentIndex=0;
    }
    this.loadCurrentSong();
  },
  prevSong: function(){
    this.currentIndex--;
    if(this.currentIndex<0){
      this.currentIndex=this.songs.length-1;
    }
    this.loadCurrentSong();
  },
  playRandomSong: function(){
    let newIndex;
    do{
      newIndex= Math.floor(Math.random()*this.songs.length);
      if(this.oldArrayIndex.length>=this.songs.length){
        this.oldArrayIndex=[];
      }else{
        var result= this.oldArrayIndex.find((ElementIndex,index)=>{
          return ElementIndex===newIndex;
        });
        if(!result){
          this.oldArrayIndex.push(newIndex);
        }
      }
    }while(newIndex===this.currentIndex);
    this.currentIndex=newIndex;
    this.loadCurrentSong();
  },
  scrollToActiveSong: function(){
    setTimeout(function(){
      $('.song.active').scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    },200)
  },
  handleEvent(){
    const _this=app
    //xử lý xoay cd_image
    const cdImageanimate= cdImage.animate([
      {
        transform: 'rotate(360deg)'}
    ],{
      duration:10000,
      iterations:Infinity
    });
    cdImageanimate.pause();
    //xử lý phóng to thu nhỏ cd_image
    const cdWidth= cd.offsetWidth
    document.onscroll= function(){
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth-scrollTop;
      cd.style.width =newCdWidth>0? newCdWidth+'px':0;
      cd.style.opacity = newCdWidth/cdWidth;
    }
    //sử lý nút play
    playBtn.onclick = function(){
      if(app.isPlaying){
        audio.pause();
      }else{
        audio.play();
      }
    }
    audio.onplay = function(){
      app.isPlaying=true;
      player.classList.add("playing");
      cdImageanimate.play();
    }
    audio.onpause = function(){
      app.isPlaying=false;
      player.classList.remove("playing");
      cdImageanimate.pause();
    }
    //xử lý chạy time song
    audio.ontimeupdate=function(){
      if(audio.duration){
        const progressPercent = Math.floor(audio.currentTime/audio.duration *100);
        progress.value=progressPercent;
      }
    }
    //xử lý tua song 
    progress.oninput= function(e){
      const seekTime= (e.target.value*audio.duration) /100;
      audio.currentTime = seekTime;
    }
    //xử lý next/prev song 
    nextBtn.onclick= function(){
      if(app.isRandom){
        app.playRandomSong();
      }else{
        app.nextSong();
      }
      audio.play();
      app.render();
      app.scrollToActiveSong();
    }
    prevBtn.onclick= function(){
      if(app.isRandom){
        app.playRandomSong();
      }else{
        app.prevSong();
      }
      audio.play();
      app.render();
      app.scrollToActiveSong();
    }
    //xử lý random song
    randomBtn.onclick= function(){
      _this.isRandom=!app.isRandom;
      app.setConfig('isRandom',_this.isRandom)
      randomBtn.classList.toggle('active',app.isRandom);
    }
    //xử lý next song when audio ended
    audio.onended= function(){
      if(app.isRepeat){
        audio.play();
      }else{
        nextBtn.click();
      }
    }
    // xử lý repeat song
    repeatBtn.onclick= function(){
      _this.isRepeat=!app.isRepeat;
      app.setConfig('isRepeat', _this.isRepeat);
      repeatBtn.classList.toggle('active',app.isRepeat);
    }
    //xử lý click vào song
    playList.onclick= function(e){
      const songNode= e.target.closest('.song:not(.active)');
      if(songNode || e.target.closest('.option')){
        app.currentIndex= Number(songNode.dataset.index);
        app.loadCurrentSong();
        audio.play();
        app.render();
      }
    }
  },
  start(){
    //xử lý tải lại cấu hình
    this.loadConfig();
    //định nghĩa thuộc tính
    this.definedProperties();
    //sử lý lắng nghe sự kiện
    this.handleEvent();
    this.loadCurrentSong();
    //hiện thi bài hát ra trình duyệt
    this.render();
    //hiển thị trạng thái ban đầu của button repeat và random
    randomBtn.classList.toggle('active',app.isRandom);
    repeatBtn.classList.toggle('active',app.isRepeat);
  }
};
app.start();