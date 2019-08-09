var app = getApp();

Page({
    data: {
        sale: {}
    },
    onLoad() {
        wx.getStorage({
            key: 'userinfo',
            success: (res)=>{
                app.util.request({
                    url: "entry/wxapp/Performance",
                    data: { id: res.data.id },
                    success: (res) => {
                        if (res.data.code == 200) {
                            this.setData({
                                sale: res.data.data
                            });
                        }
                    }
                });
            }
        });
    }
});