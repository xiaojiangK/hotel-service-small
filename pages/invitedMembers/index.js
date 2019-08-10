var app = getApp();

Page({
    data: {
        url: ''
    },
    onLoad() {
        wx.getStorage({
            key: 'userinfo',
            success: (res)=>{
                app.util.request({
                    url: "entry/wxapp/InviteMember",
                    data: { id: res.data.id },
                    success: (res) => {
                        if (res.data.code == 200) {
                            this.setData({
                                url: res.data.data.result
                            });
                        } else {
                            wx.showToast({
                                title: res.data.msg,
                                icon: 'none'
                            });
                        }
                    }
                });
            }
        });
    },
    preview() {
        wx.previewImage({
            urls: [this.data.url]
        });
    }
});