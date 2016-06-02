/*
https://computer-programming1-wister.c9users.io
***Stuff we need to do!***
ahh, remembered what the code was:
  hline is the header line of a comment, which has the name and ideally the time posted also. The name will be a link to the profile of the user is registered, and it'll just be text otehrwise, which is how it will all be formatted.

userID for comments also a cookie?
clean code
  
something to do with comments
delete button for admins only
admin on user acc true false rainbow name because thats cool. 


  ON USER PAGES
  - Comments on user pages/blog?
  - make tabs to toggle between different things (blog posts, activity, saved images [from car builder turned person designing? XD])
  - make a blog post type setup - display avatar next to name, let them type things, and have comments on each post
  - show activity (username changes, status changes, avatar changes, blog posts, comments, saved drawings)

  PYTHON JS
  - https://www.npmjs.com/package/python-shell

  UNNECCESSARY CSS
  - dropdowns: http://www.jankoatwarpspeed.com/reinventing-a-drop-down-with-css-and-jquery/
  
  MAKE FUNCTION ON SERVER TO CHANGE ALL OCCURANCES OF A USERS NAME.
  // delete user function?
  https://www.npmjs.com/package/delivery

*/

function test(){
  $.post('madLibs.html',function(res){
    console.log(res)
    })
}

var vowels = ['a', 'e', 'i', 'o', 'u'],
  punctuation = ['.',',','!','?','"','(',")","[",']'],
  theme = 'rad';

function albox(text, mood){
  if (mood == undefined){
    mood = 'm'
  }
  var eals = document.getElementsByClassName('alert')
  if (eals.length > 0){
    $('.alert').remove()
  }
  var al = document.createElement('div'),
    header = document.getElementById('head')
  if (mood == 'm'){
    al.className = 'alert malert'
  } else if (mood == 'h'){
    al.className = 'alert halert'
  }
  al.innerHTML = text
  header.parentNode.insertBefore(al, header.nextSibling)
  $('.alert').fadeIn('fast').delay(3000).fadeOut('slow')
}

// so you can put a comment section on any page
// add user ID to name on comments. so we can compare for delete.
function allowComments(s){
  //check for admin/id etc to run this. 
  //just have this create the page in the DB? and mark it yes?
  //get page with getallcomments function and check flag for yes/no? if yes append comments and comment box. else do nothing? a
  //put yes/no flag on pages in DB
  var data={
    state:s,
    page:location.hash.split('#')[1]
  }
  $.post('allowComs',data,function(res){
    console.log(res)
  })
}

function createComment(data,element){
  //creates a comment with data appends to element.
  var comment = document.createElement('div'),
  replyBut = document.createElement('button'),
  delBut = document.createElement('button'),
  name=data.name
  function appendCom(){
    comment.appendChild(document.createTextNode(data.text))
    comment.appendChild(document.createElement('br'))
    if(data.text=='[deleted]')
      comment.appendChild(document.createElement('br'))
    delBut.innerHTML='Delete Comment'
    delBut.setAttribute('onclick','delCom(this.parentElement)')
    if(getCookie('id')==data.uId)
      if(data.type!='guest' && data.type!='err')
        comment.appendChild(delBut)
    if(getCookie('admin')!=undefined) //still not working right.
      comment.appendChild(delBut)
    replyBut.innerHTML='Reply'
    replyBut.setAttribute('onclick','comReply(this)')
    comment.appendChild(replyBut)
    comment.id=data._id
    element.appendChild(comment)
  }
  
  comment.className='comm';
  if (element.className=='comm' || element.className=='comReply'){
    comment.className='comReply'
  }
  
  if (data.type == 'registered' && name!='[deleted]' || data.type=='admin'){
    var dataName = {name: data.name} ;
    //gets user ID for name from comment ids list
    var nline='<h2><a class=\'ru\' onclick="loadProfile(\''+data.uId+'\')">'+name+'</a></h2>';
    if(data.type=='admin')
      nline='<h2><a class=\'unicorn\' onclick="loadProfile(\''+data.uId+'\')">'+name+'</a></h2>';
    comment.innerHTML=nline+'<br>'
    appendCom()
  } else if (data.type == 'guest'){
    var nline = '<h2>'+name+'</h2><br>';
    comment.innerHTML=nline;
    appendCom()
  } else {
    comment.innerHTML='<h2>'+name+'</h2><br>';
    appendCom()
  }
  //find way to change the color via the user type
  if(data.name=='[deleted]'){
    replyBut.style.display='none';
    delBut.style.display='none';
  };
}

function comReply(element){
  //Creates the reply box, add placeholder text and password box.
    element.setAttribute('onclick','comtoggle(this)');
    var parent=element.parentNode,
    replyBox=document.createElement('div'),
    replyBoxText=document.createElement('textarea'),
    nameInput=document.createElement('input'),
    passInput=document.createElement('input'),
    //reply box button
    replyBoxButton=document.createElement('button');
    replyBoxButton.className='button';
    replyBoxButton.innerHTML='Comment';
    replyBoxButton.style.marginLeft='10px';
    replyBoxButton.style.marginBottom='7px';
    replyBoxButton.setAttribute('onclick','comReplySubmit(this)');
    //name input
    nameInput.className='inter';
    nameInput.style.marginLeft='10px';
    nameInput.style.marginBottom='5px';
    nameInput.placeholder='Name'
    //password input
    passInput.className='inter';
    passInput.style.marginLeft='10px';
    passInput.style.marginBottom='5px';
    passInput.type = 'password'
    passInput.placeholder='Password (Optional)'
    //if logged in dont append
    replyBoxText.className='replyBoxText';
    if (!document.cookie){
      console.log('cookie check didnt work')
      replyBox.appendChild(nameInput);
      replyBox.appendChild(passInput);
    }
    //reply box text and appending
    replyBoxText.placeholder='Write Comment Here.'
    replyBox.appendChild(replyBoxText);
    parent.insertBefore(replyBox, parent.getElementsByTagName('div')[0]);
    replyBox.className='replyBox';
    replyBox.appendChild(replyBoxButton);
}

function comtoggle(element){
  //toggles the comment reply box.
  var hideMe=element.parentElement.getElementsByClassName('replyBox')[0];
  if (hideMe.style.display=='none'){
  hideMe.style.display='block';
  } else {
  hideMe.style.display='none';
  }
}

function comReplySubmit(element){
  if(document.cookie){
    nv=getCookie('name')
    n=nv
    pv=getCookie('pass')
    p=pv
    t = element.parentElement.getElementsByClassName('replyBoxText')[0]
  } else {
  var n = element.parentElement.getElementsByClassName('inter')[0],
      nv = n.value,
      p = element.parentElement.getElementsByClassName('inter')[0],
      pv = p.value,
      t = element.parentElement.getElementsByClassName('replyBoxText')[0],
      ut = 'err';
  }
  
  if (nv == ''){
    n.className = 'inter redform'
    albox('Name needed.')
  } else if (pv ==''){
    ut = 'guest'
  } else if (n !== '' && p !== ''){
    //lin(n,p)
    if (document.cookie){
      ut = 'registered'
    } else {
      $('#content').load('login.html');
      // break
    }
  }
  
  var data={
    name:nv,
    text:t.value,
    type:ut,
    parentID:element.parentNode.parentNode.id,
    page:document.getElementById('content').className
  };
  if(document.cookie){
    data.uID=getCookie('id') 
  }
    $.post('writeReply',data,function(res){
      // console.log(res,res.parentID)
      createComment(res,document.getElementById(res.parentId));
    });

  t.parentNode.style.display='none';
}

function create(){

  var u = document.getElementById('u'),
  p = document.getElementById('p'),
  cp = document.getElementById('cp'),
  gender = document.getElementsByName('gender');
  
  
  u.className = 'inter';
  p.className = 'inter';
  cp.className = 'inter';
  
  for (var i=0; i < gender.length; i++){
    if (gender[i].checked){
      var gv = gender[i].value;
    }
  }
  
  var uv = u.value,
  pv = p.value,
  cpv = cp.value;
  
  var data={
    name:uv,
    pass:pv,
    gend:gv,
    t: theme
  };
  
  if (uv == ''){
    u.className = 'inter redform';
    albox('Really?');
  } else if (pv == ''){
    p.className = 'inter redform';
    cp.className = 'inter redform';
    albox('Really?');
  }else if(/ /.test(uv)){
    u.className = 'inter redform';
    albox('Your username cannot have a space.');
  } else {
    if (pv !== cpv){
      p.className = 'inter redform';
      cp.className = 'inter redform';
    } else {
      $.post('create',data,function(res){
        if (res == 'taken'){
          document.getElementById('u').className = 'inter redform';
          albox('Username taken.');
        }
        if(!res.result){
          albox('Error');
        } else {
          albox('Success.','h');
          $('#content').load('login.html')
        }
      });
    }
  }
}

function ctheme(ts){
  var links = document.getElementsByTagName('link'),
    ct = links[1],
    prof = document.getElementById('prof');
  if (getCookie('id') !== undefined){
    var user = {
        id: getCookie('id'),
        t:ts
      };
    
    $.post('updateTheme',user,function(res){
      if (res == 'err'){
        console.log('Error updating theme.');
      }
    });
  }
  
    ct.href = String('CSS_files/'+ts+'.css');
    theme = ts;
    if(getCookie('name'))
      document.cookie="theme="+theme;
}

function delCom(element){
  //check user/admin.
  var data={
    ID:element.id
  }
  if (getCookie('id')==data.ID || getCookie('admin')=='flarf'){
    $.post('delCom',data,function(res){
      element.parentNode.removeChild(element); //change from remove
    })
  } else {
    albox('YO WHATCHU DOING.')
  }
}

// display and visibility functions
function disp(id){
  var d = document.getElementById(id)
  if (getComputedStyle(d).getPropertyValue("display")=="none"){
    d.style.display="block"
  } else {
    d.style.display="none"
  }
}

function dispimmer(thing){
  var d = document.getElementById(thing)
  if (getComputedStyle(d).getPropertyValue("display")=="none"){
    d.style.display="block"
  }
}

function opToggle(id){
    var el = document.getElementById(id),
    value=getComputedStyle(el).getPropertyValue('opacity');
    if (value==0){
        el.style.opacity = 1;
    } else if (value==1){
        el.style.opacity = 0;
    }
}



function editAvatar(){ //eventually will change into a small menu to ask upload local file or use a web based image, but I'm testing local file things right now
  var pAvatar = document.getElementById('pAvatar'),
      pavDiv = document.getElementById('pavDiv'),
      //pavInput = document.createElement('textarea'),
      pavFileInput = document.createElement('input'),
      data = {id:getCookie('id')},
      paveButton = document.createElement('button')
  pAvatar.style.display = 'none'
  /*
  pavInput.className = 'inter'
  pavInput.style.height = '140px'
  pavInput.style.width = '162px'
  pavInput.style.resize = 'none'
  pavInput.id = 'pavInput'
  */
  pavFileInput.setAttribute('type','file')
  pavFileInput.addEventListener( 'change', function(e){
    var reader = new FileReader()  
    reader.onload = function( evt ){
    pAvatar.src = evt.target.result;
  }
  reader.readAsDataURL( pavFileInput.files[0] )
})
  pavFileInput.id = 'pavFileInput'
  paveButton.innerHTML = 'save avatar'
  paveButton.id = 'paveButton'
  paveButton.setAttribute('onclick','updateAvatar()')
  /*
  $.post('getUserById',data,function(res){
    pavInput.value = res.av
  })
  pavDiv.appendChild(pavInput)
  */
  pavDiv.appendChild(pavFileInput)
  pavDiv.appendChild(paveButton)
}

function updateAvatar(){
  console.log('updateAvatar called.')
  var pavFileInput = document.getElementById('pavFileInput')
      //pavInput = document.getElementById('pavInput')
  $('#pavFileInput').remove()
  $('#paveButton').remove()
  $('#pAvatar').css('display','block')
}

function editLoginInfo(){
  console.log('editLoginInfo()')
  var pName = document.getElementById('pName')
}

function editProfile(){ //layout and appearance
  /*
  $.post('updateUserInfo',data,function(res){
    
  })
  */
}

function editStatus(id){
  // small bug: the br between the name and status don't remain immediately after updating, but are present if you refresh / logout and login again\\
  
  var status = document.getElementById('stat'),
    profdiv = document.getElementById('prof'),
    newStat = document.createElement('input')
  status.style.display = 'none'
  newStat.className = 'inter'
  newStat.id = 'statin'
  newStat.value = status.innerHTML
  profdiv.appendChild(newStat)
  newStat.onkeyup=function(event){
    if (event.keyCode == 13){
      updateStat(this.value)
    }    
  }
}

function updateStat(text){
  var status = document.getElementById('stat'),
      stattext = document.createTextNode(text),
      user = {
        id:getCookie('id'),
        stat:text
      }
  $.post('updateStatus',user,function(res){
    if(res=='err'){
      console.log('Error updating status.')
    }
  })
  $('#statin').remove()
  if (stattext == ''){
    stattext = '[Edit Status]'
  }
  status.innerHTML=''
  status.appendChild(stattext)
  status.style.display = 'inline'
}

function editStats(){ // status, gend, location, interests, birthday
  var name = getCookie('name'),
      pTable = document.getElementById('pTable'),
      bIlabels = ['Status:','Gender:','Location:','Interests:', 'Birthday:'],
      basicInfoIds = ['tstat','tgend','tloc','tintrests:', 'tbirth:'],
      data = {
        id: getCookie('id')
      }
  $.post('getUserById',data,function(res){
    if (res=='err'){
      console.log('How did that happen?')
    } else {
    var basicInfo=[res.stat,res.gend,res.udata[0],res.udata[1],res.udata[2]]
      $('#pTable').children().remove()
      for (var x=0; x<5; x++){
        var ntr = document.createElement('tr'),
          nth = document.createElement('th'),
          ntd = document.createElement('td'),
          newInput = document.createElement('input')
          newInput.style.width='120px'
        newInput.className = 'inter'
        newInput.id = basicInfoIds[x]
        newInput.value = basicInfo[x]
        nth.innerHTML = bIlabels[x]
        ntd.appendChild(newInput)
        ntr.appendChild(nth)
        ntr.appendChild(ntd)
        pTable.appendChild(ntr)
      }
      pTable.children[1].children[1].removeChild(pTable.children[1].children[1].children[0]) //beautiful
      var gendsel = document.createElement('select'),
          mop = document.createElement('option'),
          fop = document.createElement('option'),
          xop = document.createElement('option')
      gendsel.style.width = '125px'
      gendsel.style.overflow = 'hidden'
      gendsel.style.marginTop = '0px'
      xop.innerHTML = 'Other/Unspecified'
      xop.value = 'Other/Unspecified'
      fop.innerHTML = 'Female'
      fop.value = 'Female'
      mop.innerHTML = 'Male'
      mop.value = 'Male'
      gendsel.appendChild(xop)
      gendsel.appendChild(fop)
      gendsel.appendChild(mop)
      pTable.children[1].children[1].appendChild(gendsel)
      gendsel.value = res.gend
    }
  })
  var saveChangesButton = document.getElementById('leftprofbutton')
  saveChangesButton.innerHTML = 'save changes'
  saveChangesButton.setAttribute('onclick','updateStats()')
}

function updateStats(){
  console.log('updateStats() called')
  var pTable = document.getElementById('pTable'),
      vallist = []
  for (var x=0; x<5; x++){
    var input = pTable.children[x].children[1].children[0].value
    vallist[x] = input
  }
  var data = {
        id: getCookie('id'),
        stat: vallist[0],
        gend: vallist[1],
        udata:[vallist[2],vallist[3],vallist[4]]
      }
  $.post('updateStats',data,function(res){
  })
  updateStat(vallist[0])
  loadProfile(getCookie('id'))
}

/* stolen from W3Schools */
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length,c.length);
        }
    }
    return undefined;
}

function loadProfile(id){
  var data={'id':id}
  $('#content').load('profile.html')
  $.post('getUserById',data,function(res){
    if (res == 'err'){
      albox('Something broke in functions.js loadProfile.')
    } else if (res == 'nf'){
      albox('User not found.')
    } else {
      var pBasics = document.getElementById('pBasics'),
        pName = document.getElementById('pName'),
        pAvatar = document.getElementById('pAvatar'),
        pMain = document.getElementById('pMain'),
        pTable = document.getElementById('pTable')
      pName.innerHTML = res.name
      pAvatar.src = res.av
      var basicInfo=[res.stat,res.gend,res.udata[0],res.udata[1],res.udata[2]],
        bIlabels = ['Status:','Gender:','Location:','Interests:', 'Birthday:']
      for (var x=0; x<5; x++){
        if (basicInfo[x]!='' && basicInfo[x]!=' '){
          var ntr = document.createElement('tr'),
            nth = document.createElement('th'),
            ntd = document.createElement('td')
          nth.innerHTML = bIlabels[x]
          ntd.appendChild(document.createTextNode(basicInfo[x]))
          ntr.appendChild(nth)
          ntr.appendChild(ntd)
          pTable.appendChild(ntr)
        }
      }
      if (getCookie('name') !== undefined){
        var name = getCookie('name')
        if (name == res.name){
          var editButton = document.createElement('button')
          editButton.id = 'leftprofbutton'
          editButton.innerHTML = 'edit'
          editButton.setAttribute('onclick','editStats()')
          pBasics.appendChild(editButton)
          pAvatar.className = 'editAv'
          pAvatar.setAttribute('ondblclick','editAvatar()')
        }
      }
    }
  })
}

function lin(n, p, i){  //login
  if (typeof n!='string' || typeof p!='string'){
    var data={
      name:n.value,
      pass:p.value,
    }
  } else {
    data={
      name:n,
      pass:p
    }
  }
  $.post('login',data,function(res){
    if (res == 'nf'){
      albox('User not found. Check that your username is typed correctly.')
      n.className = 'inter redform'
      p.className = 'inter'
      n.value = ''
      p.value = ''
    } else if (res == 'invp'){
      albox('Invalid password.')
      n.className = 'inter'
      p.className = 'inter redform'
      p.value = ''
    } else {
      document.cookie = String("id="+res._id)
      document.cookie = String("name="+res.name)
      document.cookie = String("pass="+res.pass)
      document.cookie = String("theme="+res.t)
      if(res.admin)
        document.cookie= String("admin="+res.admin)
      albox('Successful login, '+getCookie('name'),'h')
      var profdiv = document.getElementById('prof'),
        av = document.getElementById('av')
      if (res.stat == ''){
        res.stat = '[Edit Status]'
      }
      var status=document.createElement('p'),
      statText=document.createTextNode(res.stat)
      status.appendChild(statText)
      status.setAttribute('id','stat')
      profdiv.innerHTML = "<span id='hname'>"+res.name+"</span><span onclick='logOut()'>   [Logout]</span><br>"
      profdiv.appendChild(status)
      var hname = document.getElementById('hname')
      hname.setAttribute('onclick','loadProfile(\"'+res._id+'\")')
      status.setAttribute('ondblclick','editStatus(\"'+res._id+'\")')
      status.maxlength = '80'
      av.src = res.av
      disp('av')
      theme = res.t
      ctheme(res.t)
      socket.emit('cookies',document.cookie)

      if (i == 'i'){
        loadProfile(res._id)
      }
    }
  })
}

function logOut(){
  if (document.cookie){
    var cookies=document.cookie.split(';')
    for (var i=0;i<cookies.length;i++){
      document.cookie=cookies[i].split("=")[0]+'=;expires=Thu, 01 Jan 1970 00:00:00 UTC'
    }
  location.reload()
  }
}

function mlfillin(){
  // mad lib fill in, mad lib input, final mad lib, completion indicator
  var mlins = document.getElementsByClassName('mlin')
  var fiml = document.getElementById('fiml')
  var eml = 'I was at my bedroom @@@<br>With a @@@ open wide,<br>when a giant @@@ slinked by my side,<br>I was filled with apprehension<br>and retreated down the stairs,<br>to be @@@ at the bottom<br>by @@@ grizzly bears.<br>We tumultuously tussled<br>till I managed to get free,<br>then I saw, with trepidation,<br>there were @@@ after me,<br>I could feel them growing close,<br>I was quivering with fear,<br>then I @@@ into quicksand<br>and began to disappear.<br>I was rescued by a @@@<br>that descended from the skies<br>to embrace me with its talons,<br>to my terror and surprise,<br>but that bird lost its purchase<br>when a @@@ made me sneeze,<br>and it dropped me in a thicket<br>where I battered both my knees.<br>I was suddenly @@@<br>by a group of @@@ trolls,<br>who @@@ informed me<br>they would toast me over coals,<br>I was @@@ to elude them<br>when they @@@ looked away-<br>that’s the reason why my homework<br>isn’t here with me today.<br><p>Modified from "A Remarkable Adventure" by Jack Prelutsky</p>'
  var cin = true
  for (var x = 0; x < 14; x++){
    // new word, replaced word index
    var nw = mlins[x].value
    var rwi = eml.indexOf('@@@')
    if (nw == '' || nw == ' '){
      mlins[x].className='inter mlin redform'
      cin = false
    } else {
      mlins[x].className='inter mlin'
      if (eml[rwi-2] == 'a' && vowels.indexOf(nw.charAt(0)) != -1){
        nw = 'n '+nw
        eml = eml.replace(' @@@',nw)
      } else {
        eml = eml.replace('@@@',nw)  
      }
    }
  }
  fiml.innerHTML = eml
  if (cin == true){
      disp('fiml')
      disp('ins')
  }
}

function processCars(){
    var postData=[],
    radioData=[],
    checkData=[]
    var inputs=document.getElementsByTagName('input')
    for (var i=0;i<inputs.length;i++){
      if(inputs[i].type=='text'){
        if(inputs[i].value!=''){
          postData.push(inputs[i].value)
          inputs[i].className='inter'
        } else{
          albox('Fill out the form!')
          inputs[i].className='inter redform'
        }
      } else if(inputs[i].type=='radio'){
        if(inputs[i].checked!=false){
          radioData.push(inputs[i].value)
        }
      } 
      if(inputs[i].type=='checkbox'){
        if(inputs[i].checked!=false){
          checkData.push(inputs[i].value)
        }
      }
    }
    if (document.getElementById('cars').value!=''){
      postData.push(document.getElementById('cars').value) 
      document.getElementById('cars').className='inter'
    } else{
      albox('Fill out the form!')
      document.getElementById('cars').className='inter redform'
    }
    if(radioData.length==0 || checkData.length==0){
      albox('Fill out the form!')
    } else {
      postData.push(radioData.join())
      postData.push(checkData.join(', '))
      var tableRow=document.createElement('tr');
      for (var i=0;i<postData.length;i++){
        var tableData=document.createElement('td');
        var text=document.createTextNode(postData[i]);
        tableData.appendChild(text);
        tableRow.appendChild(tableData);
      }
      document.getElementById('carPost').appendChild(tableRow);
    }
}

// TODO: make this function accept words without vowels --I tried, it still breaks
function transtopl(engtxt){
  // english text, english text array
    var entarr = engtxt.split(' ');
  var plresarr = []
  for (var w=0; w < entarr.length; w++){
    // initial punctuation, final punctuation, capitalized first letter
    var ipunc = '',
      fpunc = '',
      cfl = false;
    while (punctuation.indexOf(entarr[w].charAt(0)) != -1){
      ipunc = ipunc.concat(entarr[w].charAt(0))
      entarr[w]=entarr[w].slice(1)
    }
    while (punctuation.indexOf(entarr[w].charAt((entarr[w].length)-1)) != -1){
      fpunc = entarr[w].charAt((entarr[w].length)-1).concat(fpunc)
      entarr[w]=entarr[w].slice(0,-1)
    }
    if (entarr[w].charAt(0) == entarr[w].charAt(0).toUpperCase()){  
      cfl = true
    }
    entarr[w] = entarr[w].toLowerCase()
    var inenl = entarr[w].length
    console.log(inenl)
    if (vowels.indexOf(entarr[w].charAt(0)) != -1){
      entarr[w] = entarr[w].concat('way')
    } else if (vowels.indexOf(entarr[w].charAt(0)) == -1){
      var cons = ''
      while (vowels.indexOf(entarr[w].charAt(0)) == -1 || cons.length < inenl){
        cons = cons.concat(entarr[w].charAt(0))
        entarr[w] = entarr[w].slice(1)
        console.log(cons+' '+cons.length+' '+inenl)
      }
      if (cons.length==inenl){
        cons=''
        while (entarr[w].charAt(0) != 'y' || cons.length < inenl){
          cons = cons.concat(entarr[w].charAt(0))
          entarr[w] = entarr[w].slice(1)
          console.log(cons+' '+cons.length)
        }
        if (entarr[w].charAt(0)=='y'){
          entarr[w] = entarr[w].slice[1]
          entarr[w] = 'i'.concat(entarr[w])
        }
        if (cons.length = inenl){
          entarr[w]=entarr[w].concat('w')
        }
      } else {
        console.log('error 808')
      }
      entarr[w] = entarr[w].concat(cons,'ay')
    }
    if (cfl == true){
      var il = entarr[w].charAt(0).toUpperCase()
      entarr[w] = entarr[w].slice(1)
      entarr[w] = il.concat(entarr[w])
    }
    var fw = ipunc.concat(entarr[w],fpunc)
    plresarr.push(fw)
  }
  var plres = plresarr.join(' '),
    plresdiv = document.getElementById('plres')
  plresdiv.innerHTML = plres
  dispimmer('plres')
}

//dont care. thanks stack exchange.
function pigLatin(str) {
    return str.replace(/\b(\w)(\w+)\b/g, function(a,b,c) {
        if (/[A-Z]/.test(b)) { 
            c = c.replace(/^\w/, function(x) { return x.toUpperCase() });
        }
        return c + b.toLowerCase() + (/[aeiou]/i.test(b) ? 'way' : 'ay');        
    })
};


function writecomm(){
  var n = document.getElementById("mu"),
    p = document.getElementById("mp"),
    c = document.getElementById("comment").value
  n.className = 'inter'
  p.className = 'inter'
  var ut = 'err', //user type: guest/registered/login-failed
    nv = n.value,
    pv = p.value
  
  if(document.cookie){
    nv=getCookie('name')
    pv=getCookie('pass')
  }
    
  if (nv == ''){
    n.className = 'inter redform'
    albox('Name needed.')
  } else if (pv ==''){
    ut = 'guest'
  } else if (n !== '' && p !== ''){
    if (getCookie('name') !== undefined){
      ut = 'registered'
    } else {
      $('#content').load('login.html');
    }
  }
  if(c==''){
    c.className = 'inter redform'
    albox('you cant make blank comments.')
    return
  }
  if(getCookie('admin')=="flarf"){
    console.log('reply admin test.')
    ut='admin'
  }
  var data = {
    name:nv,
    type: ut,
    text:c,
    page:location.hash.split('#')[1]
  };
  if(document.cookie){
    data.uID=getCookie('id')
  }
 
  //this only gets created if the db writes the comment to the db. 
  if (nv){
    $.post('write',data,function(res){
      createComment(res,document.getElementById('subbdcomm'))
    });
  }
}

function getAllComments(){
$.post('getComs',{page:window.location.href.split('#')[1]},function(res){
  if (res.state==="true"){
    createCommentsDiv()
      for(var i = 0;i<res.docComments.length;i++){
        if (res.docComments[i].parentId!='none'){
          createComment(res.docComments[i],document.getElementById(res.docComments[i].parentId))
      } else {
          createComment(res.docComments[i],document.getElementById('subbdcomm'))
      }
    }}
  })
}

function createCommentsDiv(){
  //create comment div here
  var com=document.createElement('div')
  com.className='box'
  com.id='commentBox'
  com.innerHTML="<h2>Comments</h2><button onclick=\"disp('subcom')\">write a comment</button><div id='subcom'><div id='lot'><input id='mu' class='inter' placeholder='Name'/><input id='mp' class='inter' type='password' placeholder='Password (optional)'/><br><a id='p2b' href='#'>Register / Forgot your password?</a><br><br></div><textarea id='comment' class='inter' placeholder='Write Comment Here'></textarea><br><button onclick='writecomm()'>submit comment</button></div><div id='subbdcomm'><!-- load comments here--></div>"
  document.getElementById('content').appendChild(document.createElement('br'))
  document.getElementById('content').appendChild(document.createElement('br'))
  document.getElementById('content').appendChild(com)
  if(getCookie('name')){
    document.getElementById('lot').style.display='none'
  }
}

function updatePage(hashs){
  $('#content').load(location.hash.split('#')[1]+'.html');
  getAllComments()
  var oldURL=hashs.oldURL.split('#')[1]
  var newURL=hashs.newURL.split('#')[1]
  if(oldURL=='BallGames')
    killGame() //add stuff for socket disconnect to.
  else if(oldURL=='ChatRoom')
    socket.emit('chatDisconnect',getCookie('name'))
    
  else if(oldURL=='Snake')
    snake.end()
    
  else if(oldURL=='aversion'){
    clearInterval(gameArea.interval)
    window.removeEventListener('keydown', parseKey) 
  }
    
  if(newURL=='ChatRoom'){
    console.log('stuff')
    if(getCookie('name'))
      setTimeout(function() {socket.emit('chatJoin',getCookie('name'))}, 100)
    else
      document.getElementById('chatBox').innerHTML='You must be logged in to use that chat.'
  }
}

//chat/prompts/etc stuff
function chatParse(who,command,param1,theRest){
  var theRest=theRest.split(' ')
  theRest.splice(0,2)
  theRest=theRest.join(' ')
  /*slash commands for chat*/
  if(command.toLowerCase()=='/whisper'||command.toLowerCase()=='/w'){
    socket.emit('whisper',who,theRest,param1)
  } else if(['/piglatin','/pl'].indexOf(command.toLowerCase())>=0){
    socket.emit('message',who,pigLatin(param1+' '+theRest))
  } else if('/ban'==command.toLowerCase()){
      if(getCookie('admin')=='flarf'){
        socket.emit('chatBan',who,param1)
      }else{
        albox('YOU ARE NOT AN ADMIN.')
      }
  }  else if('/ub'==command.toLowerCase()){
      if(getCookie('admin')=='flarf'){
        socket.emit('unChatBan',who,param1)
      }else{
        albox('YOU ARE NOT AN ADMIN.')
      }
  } else{
    albox(command+' is not a slash command.')
  }
}

function pageLoadFuncs(){
  var page = location.hash.split('#')[1]
  if(page=='ChatRoom'){
    if(getCookie('name'))
      setTimeout(function() {socket.emit('chatJoin',getCookie('name'))}, 100)
    else
      document.getElementById('chatBox').innerHTML='You must be logged in to use that chat.'
  }
}



//flair stuff
function unicorn(){
  //broken.
  var step = 4,
    ms   = 50,  // loop every
    $uni = $('.unicorn'),
    txt  = $uni.text(),
    len  = txt.length/$uni.length,
    lev  = 360/len,
    newCont = "",
    itv;

for(var i=0; i<len; i++)newCont += "<span style='color:hsla("+ i*lev +", 100%, 50%, 1)'>"+ txt.charAt(i) +"</span>";

$uni.html(newCont); // Replace with new content
var $ch = $uni.find('span'); // character

  itv = setInterval(function(){
    $ch.each(function(){
      var h = +$(this).attr('style').split(',')[0].split('(')[1]-step % 360;
      $(this).attr({style:"color:hsla("+ h +", 100%, 50%, 1)"});
    });
  }, ms); 
}

//sitewide rickRoll? just change to the sitewide function? XD
function rickRoll(){
  var lyrics=['Never gonna give you up',
            'Never gonna let you down',
            'Never gonna run around and desert you',
            'Never gonna make you cry',
            'Never gonna say goodbye',
            'Never gonna tell a lie and hurt you' 
            ]
  for(var i=1; i<100;i++){
    for(var g=0;g<6;g++){
      setTimeout(rick2, 4000*(6*i+(g-6)),lyrics[g],'h')
      //setTimeout(socket.emit, 4000*(6*i+(g-6)),'alert',lyrics[g])
      //setTimeout(function() {socket.emit('alert',g);}, 4000*(6*i+(g-6)) )
      // I feel like I spend too long on this, but it works now
  }}
}

function rick2(lyrics,hap){
  socket.emit('alert',lyrics)
}