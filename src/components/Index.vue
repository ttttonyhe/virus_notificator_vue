
<template>
  <div class="container" v-show="show">
    <div class="wap">
      <div class="title">
        <h1>新型冠状病毒疫情数据订阅</h1>
        <p>使用邮箱或 RSS 订阅 2019-nCov 疫情数据每日推送</p>
      </div>
      <zi-note>
        数据将实时同步并自
        <zi-link href="https://ncov.dxy.cn/ncovh5/view/pneumonia" color>丁香园·丁香医生</zi-link> 获取
      </zi-note>
      <div class="form">
        <div>
          <zi-row gutter="15">
            <zi-col span="16">
              <zi-input
                prefix-label="Email"
                class="email"
                v-model="emailAddress"
                type="email"
                placeholder="example@email.com"
                autofocus
                size="big"
              ></zi-input>
            </zi-col>
            <zi-col span="8">
              <zi-button
                class="subscribe"
                type="success"
                @click="verifyMailExist()"
                :loading="emailLoading"
              >
                <i class="ri-mail-send-line icon"></i> 订阅 / 管理
              </zi-button>
            </zi-col>
          </zi-row>
        </div>
      </div>
      <div class="rss">
        <zi-card>
          <i class="ri-rss-fill icon"></i>&nbsp;&nbsp;&nbsp;RSS 订阅地址：
          <zi-link href="https://node.ouorz.com/rss" color>https://node.ouorz.com/rss</zi-link>
        </zi-card>
      </div>

      <!-- 弹出模块 -->
      <!-- 管理订阅 -->
      <zi-dialog v-model="showDialog.manage" title="管理订阅" done="完成" cancel="取消">
        <div class="dialog-section">
          <zi-description title="修改你的推送订阅邮箱地址" content="修改邮箱地址" />
          <div class="dialog-input">
            <zi-row gutter="15">
              <zi-col span="16">
                <zi-input size="medium" class="dialog-email" v-model="userData.email" type="email"></zi-input>
              </zi-col>
              <zi-col span="8">
                <zi-button
                  class="edit-button-1"
                  size="medium"
                  type="primary"
                  :loading="editLoading.email"
                  auto
                  @click="editEmail()"
                >修改</zi-button>
              </zi-col>
            </zi-row>
          </div>
        </div>
        <div class="dialog-section">
          <zi-description title="修改你的推送订阅省份与城市信息" content="修改数据源" />
          <div class="dialog-input">
            <zi-row gutter="15">
              <zi-col :span="(!!userData.province && userData.province !== '无省份') ? 9 : 13">
                <zi-select size="medium" v-model="userData.province">
                  <template v-if="userData.province == '无省份'">
                    <zi-option value="无省份" selected="selected">无省份</zi-option>
                  </template>
                  <zi-option
                    v-for="(pro,index) in showData.province"
                    :value="pro.provinceName"
                    v-bind:key="index"
                  >{{ pro.provinceName }}</zi-option>
                </zi-select>
              </zi-col>
              <zi-col span="9" v-if="!!userData.province && userData.province !== '无省份'">
                <zi-select size="medium" v-model="userData.city">
                  <template v-if="showData.province[userData.province].citiesName.length == 0">
                    <zi-option selected="selected" value="无城市">无城市</zi-option>
                  </template>
                  <template v-else>
                    <zi-option
                      v-for="(city,index) in showData.province[userData.province].citiesName"
                      :value="city"
                      v-bind:key="index"
                    >{{ city }}</zi-option>
                  </template>
                </zi-select>
              </zi-col>
              <zi-col span="5">
                <zi-button
                  class="edit-button-2"
                  type="primary"
                  size="medium"
                  auto
                  :loading="editLoading.info"
                  @click="editInfo()"
                >修改</zi-button>
              </zi-col>
            </zi-row>
          </div>
        </div>
        <div class="dialog-section">
          <zi-description title="退出每日疫情数据推送订阅" content="退出订阅" />
          <div class="dialog-input">
            <zi-tooltip content="你将需要重新输入邮箱地址以再次订阅" placement="top">
              <zi-button
                @click="unsubscribeEmail()"
                :loading="editLoading.unsubscribe"
                class="edit-button-2"
                type="danger"
                size="medium"
                auto
              >退出邮件订阅</zi-button>
            </zi-tooltip>
          </div>
        </div>
      </zi-dialog>
      <!-- 管理订阅 -->
      <zi-dialog v-model="showDialog.subscribe" title="订阅成功" done="完成" cancel="取消">
        <div class="subscribe-success">
          <p>你已经成功订阅疫情数据每日推送</p>
          <p>你将在每天 23:00 收到你所选择的省份/城市最新数据与全国状况统计</p>
        </div>
        <zi-row gutter="15">
          <zi-col span="15">
            <zi-button
              class="edit-button"
              @click="fillInfo()"
              :loading="editLoading.fill"
              type="success"
              size="medium"
              auto
            >订阅信息完善</zi-button>
          </zi-col>
          <zi-col span="9">
            <zi-button
              @click="unsubscribeEmail()"
              :loading="editLoading.unsubscribe"
              class="edit-button"
              size="medium"
              auto
            >取消订阅</zi-button>
          </zi-col>
        </zi-row>
      </zi-dialog>
      <!-- 弹出模块 -->

      <div class="qanda">
        <zi-fieldset>
          <h1>
            <i class="ri-mail-fill icon"></i> 如何使用 Email 邮箱订阅疫情数据推送
          </h1>
          <p>你可以使用本页页面上方的邮箱输入框进行订阅，系统将自动检测邮箱的订阅状态。使用邮件订阅服务的已订阅用户将可以对订阅服务进行个性化管理，订阅者能够随时修改:</p>
          <p class="tag">
            <zi-tag>订阅邮箱地址</zi-tag>
            <zi-tag>订阅城市</zi-tag>
            <zi-tag>订阅省份</zi-tag>
            <zi-tag>订阅状态</zi-tag>
          </p>
          <p>
            成为订阅者后你将在每天的
            <b>23:00</b> 收到一份包含
            <b>全国数据</b>、
            <b>省份/城市</b>数据的邮件推送。你也可以使用订阅服务管理随时退出取消邮件订阅。
          </p>
        </zi-fieldset>
        <zi-fieldset>
          <h1>
            <i class="ri-rss-fill icon"></i> 如何使用 RSS 地址订阅疫情数据推送
          </h1>
          <p>你可以使用本页页面上方的 RSS 链接进行订阅，系统将自动生成包含全国数据、全国全省数据、全国全市数据内容段。订阅方法可见:</p>
          <p>
            <zi-tag class="link">
              <zi-link
                href="http://jingyan.baidu.com/article/e73e26c0c73e1f24adb6a70f.html"
              >http://jingyan.baidu.com/article/e73e26c0c73e1f24adb6a70f.html</zi-link>
            </zi-tag>
          </p>
          <p>
            我们的 RSS 订阅源每
            <b>5:00</b> 分钟更新一次，你可以随时在你使用的订阅端取消订阅。
          </p>
        </zi-fieldset>
        <zi-fieldset>
          <h1>
            <i class="ri-code-box-fill icon"></i> 全国疫情数据 API 接口文档
            <zi-tag type="success">服务状态 : 正常</zi-tag>
          </h1>
          <p>你可以使用以下接口进行查询，支持跨域请求，系统将自动生成 Json 数据并返回。API 接口列表和使用方法如下:</p>
          <p>
            <zi-tag class="link">全国全省全市数据: https://node.ouorz.com/api/all</zi-tag>
            <zi-tag class="link">全省数据: https://node.ouorz.com/api/province/:province</zi-tag>
            <zi-tag class="link">全市数据: https://node.ouorz.com/api/city/:city</zi-tag>
          </p>
          <p>API 请求样例，注意城市名不带「市」：</p>
          <p>
            <zi-tag class="link">四川省数据: https://node.ouorz.com/api/province/四川省</zi-tag>
            <br />
            <zi-tag class="link">成都市数据: https://node.ouorz.com/api/city/成都</zi-tag>
          </p>
        </zi-fieldset>
      </div>

      <div class="copy">
        <p>
          <zi-link href="https://github.com/HelipengTony/virus_notificator_vue">
            <i class="ri-github-fill icon git"></i> Open-Source
          </zi-link>&nbsp;|&nbsp;Made with
          <i class="ri-heart-2-fill icon"></i> by
          <zi-link href="https://www.ouorz.com">TonyHe</zi-link>
        </p>
      </div>
    </div>
  </div>
</template>

<style scope lang="scss">
html {
  background-color: #f7f7f7 !important;
}
body {
  background-color: transparent !important;
}
.zi-toast .message {
  font-weight: 600;
  font-size: 1rem;
}

@media screen and (max-width: 600px) {
  .zi-toast {
    width: 36.5vh !important;
  }
  .container {
    width: 100% !important;
    padding: 0px !important;
    height: auto !important;
    margin: 0 auto !important;
    border-radius: 0px !important;
    .wap {
      margin: 30px 30px 0px 30px;
      .title {
        h1 {
          font-size: 1.5rem !important;
        }
        p {
          font-size: 0.85rem !important;
        }
      }
      .form {
        .zi-row {
          display: grid;
          .zi-col-16 {
            width: 100%;
          }
          .zi-col-8 {
            width: 100%;
            margin-top: 15px;
          }
        }
      }
      .zi-fieldset-content {
        h1 {
          font-size: 1.3rem !important;
        }
        p {
          font-size: 0.9rem !important;
        }
        .tag {
          line-height: 2.4;
        }
      }
    }
  }
}
.container {
  width: 40vw;
  height: calc(100vh - 110px);
  overflow: hidden;
  overflow-y: scroll;
  padding: 40px 60px 0px 60px;
  margin: 35px auto;
  box-shadow: 0 2px 3px 0 rgba(213, 213, 213, 0.7);
  border-radius: 3px;
  background: #fff;
  .icon {
    display: inline-block;
    vertical-align: middle;
  }
  .title {
    h1 {
      font-family: Avenir;
      font-size: 2.5rem;
      color: #333;
      margin: 0px;
      letter-spacing: 0px;
    }
    p {
      font-family: Avenir;
      font-size: 1.2rem;
      color: #999;
      margin-top: -6px;
      letter-spacing: 0px;
    }
  }
  .form {
    margin-top: 30px;
    .email {
      width: 100%;
      input {
        color: #555;
        background: #fff;
      }
    }
    .subscribe {
      width: 100%;
      height: 100%;
      font-weight: 500;
      font-size: 1.05rem;
      min-width: auto;
    }
  }
  .rss {
    margin-top: 20px;
    .zi-card {
      color: #888;
    }
  }
  .qanda {
    margin-top: 50px;
    .zi-fieldset {
      margin-bottom: 30px;
      &:last-child {
        margin-bottom: 50px;
      }
    }
    .zi-fieldset-content {
      h1 {
        font-size: 1.6rem;
        line-height: normal;
        margin-bottom: 5px;
      }
      p {
        font-size: 1rem;
        line-height: 1.6;
        color: #555;
      }
      .zi-tag {
        margin-right: 7px;
        &:last-child {
          margin-right: 0px;
        }
      }
      .link {
        max-width: 85%;
        overflow: hidden;
        white-space: nowrap;
      }
    }
    .zi-fieldset-footer {
      padding-left: 20px;
    }
  }
  .copy {
    color: #666;
    text-align: center;
    margin: 0px auto 50px auto;
    p {
      i {
        color: #e74b3c;
      }
      .git {
        color: #333 !important;
      }
    }
  }
  .dialog-email {
    width: 100%;
    input {
      color: #555;
      background: #fff;
    }
  }
  .zi-description-content {
    font-size: 1.2rem !important;
  }
  .dialog-input {
    margin-top: 20px;
  }
  .zi-dialog-wrapper {
    .body {
      .dialog-section {
        margin-bottom: 40px;
        &:last-child {
          margin-bottom: 20px;
        }
        &:nth-child(1) {
          margin-top: 20px;
        }
      }
    }
    .subscribe-success {
      line-height: 1.6;
      p {
        margin: 0px;
        font-size: 1rem;
        &:last-child {
          margin-bottom: 20px;
        }
      }
    }
    .header {
      font-size: 1.8rem !important;
      font-weight: 600 !important;
      letter-spacing: 0.5px;
    }
    .edit-button {
      width: 100%;
      font-weight: 500;
      font-size: 0.95rem;
    }
    .edit-button-1 {
      height: calc(100% - 2px);
      font-weight: 500;
      font-size: 0.95rem;
    }
    .edit-button-2 {
      margin-top: 1px;
      font-weight: 500;
      font-size: 0.95rem;
    }
  }
}
</style>

<script>
import axios from "axios";
import qs from "qs";
export default {
  name: "Index",
  props: {
    msg: String
  },
  data: () => ({
    show: false,
    value: "",
    emailAddress: "",
    emailLoading: false,
    showDialog: {
      manage: false,
      subscribe: false
    },
    userData: {
      first: {
        email: "",
        province: "",
        city: ""
      },
      email: "",
      province: "",
      city: ""
    },
    showData: {
      country: {},
      province: {},
      city: {}
    },
    editLoading: {
      email: false,
      info: false,
      fill: false,
      unsubscribe: false
    }
  }),
  watch: {
    "userData.province": {
      handler() {
        //更改省份选择时赋值城市为改变后省份的第一个城市
        if (this.userData.province !== this.userData.first.province) {
          if (
            this.showData.province[this.userData.province].citiesName.length !==
            0
          ) {
            this.userData.city = this.showData.province[
              this.userData.province
            ].citiesName[0];
          } else {
            this.userData.city = "无城市";
          }
        }
      },
      deep: true
    }
  },
  mounted() {
    axios
      .get("https://node.ouorz.com/api/all")
      .then(res => {
        if (res.data.status) {
          this.showData.country = {
            confirm: res.data.total_confirmed,
            death: res.data.total_death,
            cured: res.data.total_cured
          };
          this.showData.province = res.data.data.provinces_data;
          this.showData.city = res.data.data.cities_data;
          this.show = true;
        }
      })
      .catch(() => {
        this.$Toast.show({
          type: "danger",
          text: "请求失败，请重试"
        });
      });
  },
  methods: {
    verifyMailExist() {
      this.emailLoading = true;
      axios
        .get("https://node.ouorz.com/verify/mail/exist/" + this.emailAddress)
        .then(res => {
          setTimeout(() => {
            if (res.data.status) {
              this.showDialog.subscribe = false;
              this.editLoading.fill = false;
              this.showDialog.manage = true;
              this.userData = {
                first: {
                  //首次获得的数据
                  email: res.data.data.email,
                  province:
                    res.data.data.province === undefined
                      ? "无省份"
                      : res.data.data.province,
                  city: res.data.data.city
                },
                email: res.data.data.email,
                province:
                  res.data.data.province === undefined
                    ? "无省份"
                    : res.data.data.province,
                city: res.data.data.city
              };
            } else {
              this.subscribeEmail();
            }
            this.emailLoading = false;
          }, 500);
        })
        .catch(() => {
          setTimeout(() => {
            this.$Toast.show({
              type: "danger",
              text: "请求失败，请重试"
            });
            this.emailLoading = false;
          }, 500);
        });
    },
    subscribeEmail() {
      axios
        .post(
          "https://node.ouorz.com/subscribe/mail",
          qs.stringify({
            email: this.emailAddress
          })
        )
        .then(res => {
          if (res.data.status) {
            this.$Toast.show({
              type: "success",
              text: res.data.msg
            });
            this.userData.email = this.emailAddress;
            this.showDialog.subscribe = true;
          } else {
            this.$Toast.show({
              type: "warning",
              text: res.data.msg
            });
            window.location.reload();
          }
        })
        .catch(() => {
          this.$Toast.show({
            type: "danger",
            text: "请求失败，请重试"
          });
        });
    },
    unsubscribeEmail() {
      this.editLoading.unsubscribe = true;
      axios
        .post(
          "https://node.ouorz.com/unsubscribe/mail",
          qs.stringify({
            email: this.userData.email
          })
        )
        .then(res => {
          if (res.data.status) {
            setTimeout(() => {
              this.$Toast.show({
                type: "success",
                text: res.data.msg
              });
              this.editLoading.unsubscribe = false;
              window.location.reload();
            }, 500);
          } else {
            this.$Toast.show({
              type: "danger",
              text: "请求失败，请重试"
            });
          }
        })
        .catch(() => {
          this.$Toast.show({
            type: "danger",
            text: "请求失败，请重试"
          });
          this.editLoading.unsubscribe = false;
        });
    },
    fillInfo() {
      this.editLoading.fill = true;
      setTimeout(() => {
        this.verifyMailExist();
      }, 500);
    },
    editEmail() {
      this.editLoading.email = true;
      axios
        .post(
          "https://node.ouorz.com/subscribe/mail/edit",
          qs.stringify({
            original_email: this.userData.first.email,
            current_email: this.userData.email
          })
        )
        .then(res => {
          if (res.data.status) {
            this.$Toast.show({
              type: "success",
              text: res.data.msg
            });
            this.userData.first.email = this.userData.email; //修改成功替换 first 数据
          } else {
            this.$Toast.show({
              type: "warning",
              text: res.data.msg
            });
            this.userData.email = this.userData.first.email;
          }
          this.editLoading.email = false;
        })
        .catch(() => {
          this.$Toast.show({
            type: "danger",
            text: "请求失败，请重试"
          });
          this.userData.email = this.userData.first.email;
          this.editLoading.email = false;
        });
    },
    editInfo() {
      this.editLoading.info = true;
      axios
        .post(
          "https://node.ouorz.com/subscribe/mail/edit/info",
          qs.stringify({
            email: this.userData.first.email,
            province: this.userData.province,
            city: this.userData.city
          })
        )
        .then(res => {
          if (res.data.status) {
            this.$Toast.show({
              type: "success",
              text: res.data.msg
            });
            this.userData.first.province = this.userData.province; //修改成功替换 first 数据
            this.userData.first.city = this.userData.city;
          } else {
            this.$Toast.show({
              type: "warning",
              text: res.data.msg
            });
            this.userData.province = this.userData.first.province;
            this.userData.city = this.userData.first.city;
          }
          this.editLoading.info = false;
        })
        .catch(() => {
          this.$Toast.show({
            type: "danger",
            text: "请求失败，请重试"
          });
          this.userData.province = this.userData.first.province;
          this.userData.city = this.userData.first.city;
          this.editLoading.info = false;
        });
    }
  }
};
</script>