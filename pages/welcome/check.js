// pages/welcome/check.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isUserAgree : false,
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //先发一个login确认有没有注册过
    wx.login({
      success:res=>{
        wx.request({
          data:{
            "code":res.code,
          },
          url: app.globalData.url+'/user/login',
          method:'POST',
          header:{
            'content-type':'application/json'
          },
          success:function(res2){
            console.log(res2);
            if(res2.data.data.code=="login"){
              wx.setStorageSync("token", res2.cookies[0])
              if(res2.data.data.jirenMsgNum>0){
                app.globalData.noticeNum = res2.data.data.jirenMsgNum
              }
              wx.switchTab({
                url: '/pages/jishi/main',
              })
            }
            else if(res2.data.data.code=="blocked"){
              console.log("已被封号");
              wx.showToast({
                icon:'error',
                title: '已被封号',
              })
              wx.redirectTo({
                url: '/pages/welcome/blocked',
              })
            }
          },
          fail(err){
            console.log(err);
          }
          
        })
      }
    })
  },

  
  onLogin(){
    let isUserAgree = this.data.isUserAgree;
    if(isUserAgree){
      wx.getUserProfile({
        desc: '获取您的昵称、头像信息，用于注册账号~', 
        success: (res) => {
          var myInfo =res.userInfo
          console.log(myInfo)
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          });
          wx.login({
            success:res=>{
              console.log('跳转统一身份认证登录');
              console.log(res.code)
              wx.request({
                data:{
                  "code":res.code,
                  "nickName":myInfo.nickName,
                  "gender":myInfo.gender,
                  "wxAvatarUrl":myInfo.avatarUrl,
                  "avatarUrl":myInfo.avatarUrl
                },
                url: app.globalData.url+'/user/login',
                method:'POST',
                header:{
                  'content-type':'application/json'
                },
                success:function(res2){
                  console.log(res2);
                  if(res2.data.data.code=="register"){
                    wx.setStorageSync("token", res2.cookies[0])
                    wx.showToast({
                      title: '注册成功！',
                      icon:'success'
                    })
                    wx.switchTab({
                      url: '/pages/jishi/main',
                    })
                  }else{
                    console.log("看下哪有问题")
                  }
                }
              })
            }
          })
    
        }
      })

    }else{
      wx.showToast({
        title: '请勾选同意许可~',
        icon:'error'
      })
    }

  },

  onCheckboxChange(e){
    let result = e.detail.value;
    if(result.length > 0){
      this.setData({
        'isUserAgree' : true
      })
    }else{
      this.setData({
        'isUserAgree' : false
      })
    }
  }

})