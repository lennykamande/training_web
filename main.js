const eventBus = new Vue();

Vue.component("create-project", {
    template: `
<div class="col s12 m6 l4 home-project">
            <a href="my_project/new" class="black-text">
                <div class="card project-home-container">
                    <div class="card-image project-image-container center-text" style="background-image: url('static/img/new-project-image.svg')">
                        <!--<img class="project-image" src="/img/new-project-image.svg">-->
                        <p class="project-title white-text center-align" style="padding-top: 30px; font-size: 30px">Start your</p>
                        <p class="project-title white-text center-align" style="font-size: 30px">own project</p>
                    </div>
                </div>
            </a>
        </div>
  `,
});

Vue.component("payments", {
    template: `
  <div class="col m4 s12">

            <div class="card fund-project-card">

                <div class="card-content">
                    <div class="row total-cost-row">
                        <h4 class="fund-project-total-due">Total Cost:
                            {{ currency }}<span>{{ final_amount }}</span>
                            <div class="exchange-rate-values">

                      </div>
                        </h4>

                        <div v-if="selected_reward_custom_amount > 0">
                            +&nbsp;&nbsp;&nbsp;{{ currency }}{{ selected_reward_custom_amount }} - <span>custom amount</span>
                        </div>
                        <div v-show="selected_reward_requires_shipping && selected_reward_shipping_fee > 0" class="fund-project-additional">
                            +&nbsp;&nbsp;&nbsp;{{ currency }}{{ selected_reward_shipping_fee }} - <span>delivery fee</span>
                        </div>

                    </div>

                    <!-- payment options remove Paypal -->
                    <form type="post" name="paymentForm" novalidate>
                      <div class="col s12">
                        <div class="row">
                          <h5 class="fund-project-selected-payment-method">
                            Select Payment Method:
                          </h5>

                          <div class="col s12">
                            <input name="payment"
                              v-model="selected_payment_method" id="payment4" class="with-gap" type="radio" value="PayPal"/>
                            <label class="fund-project-payment-method-label" for="payment4">
                              Visa/Master Card (International)</label>
                          </div>

                          <div class="col s12">
                            <input name="payment"
                              v-model="selected_payment_method" id="payment1" class="with-gap" type="radio" value="CC"/>
                            <label class="fund-project-payment-method-label" for="payment1">
                              Visa/Master Card (South Africa)</label>
                          </div>

                          <div class="col s12">
                            <input name="payment" v-model="selected_payment_method" id="payment2"class="with-gap" type="radio" value="EFT"/>
                            <label class="fund-project-payment-method-label" for="payment2">EFT Bank Transfer</label>
                          </div>

                          <div class="col s12">
                            <input  name="payment" v-model="selected_payment_method" id="payment3" class="with-gap"  type="radio"
                              value="MPESA"/>
                            <label class="fund-project-payment-method-label" for="payment3">M-Pesa (Mobile Money)</label>
                          </div>

                        </div>
                      </div>

                      <div class="col s12 shipping-details">
                        <div class="fund-project-additional fund-project-personal-details">
                          Personal Details
                        </div>

                                <label for="email" class="fund-project-personal-details-label">Email</label>
                                <input placeholder="Email" id="email" type="email" v-model="email" class="validate" required/>

                                <label for="display_name" class="fund-project-personal-details-label">Name</label>
                                <input placeholder="Name" id="display_name" v-model="name" type="text" class="validate" required/>

                                <label v-if="selected_payment_method == 'CC' | selected_payment_method == 'EFT'"
                                  for="phone_number" class="fund-project-personal-details-label">Phone Number (optional)</label
                                >
                                <input v-if="selected_payment_method == 'CC' | selected_payment_method == 'EFT'"
                                  placeholder="Phone Number" id="phone_number" type="text" v-model="phone_number"/>

                                <label v-if="selected_payment_method == 'MPESA'" for="phone_number" class="fund-project-personal-details-label"
                                  >Phone Number</label
                                >
                                <input v-if="selected_payment_method == 'MPESA'" placeholder="Phone Number"  id="phone_number" type="text" v-model="phone_number"
                                required
                                />

                                <span v-if="msg.phone_number">{{msg.phone_number}}</span>

                                <label for="personal_message_name" class="fund-project-personal-details-label">Display Name (optional)</label>
                                <input placeholder="Anonymous if blank" id="personal_message_display_name" type="text"
                                  v-model="personal_message_name"
                                />

                                <label for="personal_message" class="fund-project-personal-details-label">Personal Message (optional)</label
                                >
                                <input placeholder="Your message." id="personal_message" v-model="personal_message" type="text" class="validate"
                                  maxlength="200"
                                />
                                <span class="personal-message-text">
                                  This will be displayed on the campaign page.
                                </span>
                              </div>

                              <div class="clearfix"></div>

                                <div class="col s12 shipping-details" v-if="selected_reward_requires_shipping">
                                  <div class="fund-project-additional fund-project-personal-details"
                                  >
                                    Delivery Details
                                  </div>

                                  <label for="address_1" class="fund-project-personal-details-label">Address 1</label
                                  >
                                  <input placeholder="Address line 1" id="address_1" v-model="address_1" type="text" class="validate"
                                    required
                                  />

                                  <label for="address_2" class="fund-project-personal-details-label">Address line 2 (optional)</label
                                  >
                                  <input placeholder="Address line 2" id="address_2" v-model="address_2" type="text" class="validate"
                                  />

                                  <label for="country" class="fund-project-personal-details-label"
                                    >Country <span>(with delivery fee)</span></label
                                  >

                                  <select id="country" class="browser-default fund-project-country-select" v-model="selected_country">
                                    <option v-for="country in countries" :value="country.country" :key="country.id">{{country.country}}</option>
                                  </select>

                                  <label
                                    for="postcode"
                                    class="fund-project-personal-details-label"
                                    >Postal Code</label
                                  >
                                  <input placeholder="Post Code" id="postcode" v-model="postcode"
                                    type="text"
                                    class="validate"
                                    required
                                  />

                                  <label for="city" class="fund-project-personal-details-label"
                                    >City</label
                                  >
                                  <input placeholder="City" id="city" type="text" v-model="city" class="validate" required
                                  />

                                  <label for="region" class="fund-project-personal-details-label"
                                    >Province / State</label
                                  >
                                  <input placeholder="Province / State" v-model="province" id="region" type="text" class="validate" required
                                  />
                                </div>

                                <div class="row" v-show="selected_payment_method === 'PayPal'">
                                  <div class="col s12 right">
                                    <div ref="paypal" style="padding-top:10px;"></div>
                                  </div>
                                </div>


                                  <div class="col s12 right">
                                    <button type="submit" @click.prevent="processPayment"
                                    class="waves-effect waves-light btn-large orange white-text proceed-payment"
                                    :disabled='!isComplete'>
                                      Next: Pay
                                      <i class="fa fa-chevron-right"></i>
                                    </button>


                                    <span class="refund-message" v-if="selected_payment_method == 'CC'">
                                      If this project fails to reach its goal, you will be
                                      refunded roughly {{ currency }}{{
                                      final_amount -
                                      ((final_amount*0.039+2)+((final_amount*0.039+2)*0.14))
                                       }} due to banking fees.
                                    </span>

                                    <span class="refund-message"
                                      v-if="selected_payment_method == 'EFT' "
                                    >
                                      If this project fails to reach its goal, you will be
                                      refunded {{ currency }}{{
                                      final_amount - 10 }} due to
                                      banking fees.
                                    </span>

                                  </div>
                                  <span :disabled="selected_payment_method == ''" > By contributing to this campaign you agree to
                                  Thundafunds Terms and Conditions
                                  </span>

                                </div>
                              </form>

                            </div>


                </div>

          </div>

  </div>
  `,
    import: { eventBus },
    props: {
        final_amount: Number,
        projectid: String,
    },
    data: function() {
        return {
            currency: "",
            quantity: 1,
            reward_description: "",
            reward_id: "",
            additionalAmount: false,
            selected_reward_custom_amount: 0,
            selected_payment_method: "",
            selected_reward_shipping_fee: 0,
            selected_reward_requires_shipping: false,
            international_fix_cost: 0,
            email: "",
            name: "",
            phone_number: "",
            personal_message_name: "",
            personal_message: "",
            msg: [],

            province: "",
            postcode: "",
            city: "",
            selected_country: "",
            address_2: "",
            address_1: "",

            countries: [
                { id: 1, country: "Kenya", fee: "0" },
                { id: 2, country: "Gambia", fee: "0" },
                { id: 3, country: "South Africa", fee: "0" },
                { id: 4, country: "Zambia", fee: "0" },
                { id: 5, country: "Nigeria", fee: "0" },
                { id: 6, country: "United State", fee: "0" },
                { id: 7, country: "UK", fee: "0" },
                { id: 8, country: "Australia", fee: "0" },
            ],
        };
    },
    created: function() {
        this.get_currency();
        eventBus.$on("quantitychanged", (quantity) => {
            this.quantity = quantity;
        });
        eventBus.$on("rewardchosen", (description) => {
            this.reward_description = description;
        });
        eventBus.$on("rewardid", (id) => {
            this.reward_id = id;
        });
        eventBus.$on("requiresshipping", (details) => {
            this.selected_reward_requires_shipping = details;
        });
        eventBus.$on("shippingamount", (amount) => {
            this.selected_reward_shipping_fee = amount;
        });
        eventBus.$on("customamount", (custom) => {
            this.selected_reward_custom_amount = custom;
        });
    },
    mounted: function() {
        const script = document.createElement("script");
        script.src =
            "https://www.paypal.com/sdk/js?client-id=AQTyFF_55yeqGBSawznBkAV-aTBa_VwuPTHNUopG_Qyw-5C6d-NYQ9-J6aSQlWEGxaazhjD4ATOvRUeM";
        script.addEventListener("load", this.setLoaded);
        document.body.appendChild(script);
    },

    watch: {
        phone_number(value) {
            this.phone_number = value;
            this.validatePhone(value);
        },
    },
    computed: {
        isComplete() {
            if (this.selected_payment_method == "MPESA") {
                return this.email && this.name && this.phone_number;
            } else {
                return this.email && this.name;
            }
        },
    },
    methods: {
        processPayment: function() {
            if (this.selected_payment_method == "CC") {
                axios
                    .post("/process_payment/" + this.projectid, {
                        payment_method: this.selected_payment_method,
                        total_amount: this.final_amount,
                        email_address: this.email,
                        display_name: this.name,
                        phone_number: this.phone_number,
                        personal_message: this.personal_message,
                        personal_message_name: this.personal_message_name,
                        reward_id: this.reward_id,
                        reward_description: this.reward_description,
                        delivery_amount: this.selected_reward_shipping_fee,
                        additional_amount: this.selected_reward_custom_amount,
                        address_1: this.address_1,
                        city: this.city,
                        country: this.selected_country,
                        postcode: this.postcode,
                        region: this.province,
                    })
                    .then(function(response) {
                        $("#Mode").val(response.data.Mode);
                        $("#MerchantID").val(encodeURIComponent(response.data.MerchantID));
                        $("#ApplicationID").val(
                            encodeURIComponent(response.data.ApplicationID)
                        );
                        $("#MerchantReference").val(response.data.MerchantReference);
                        $("#Amount").val(response.data.Amount);
                        $("#Currency").val(response.data.Currency);
                        $("#RedirectSuccessfulURL").val(
                            response.data.RedirectSuccessfulURL
                        );
                        $("#RedirectFailedURL").val(response.data.RedirectFailedURL);
                        $("#Variable1").val(response.data.Variable1);
                        $("#Qty1").val(response.data.Qty1);
                        $("#ItemRef1").val(response.data.ItemRef1);
                        $("#ItemDescr1").val(response.data.ItemDescr1);
                        $("#ItemAmount1").val(response.data.ItemAmount1);
                        $("#frmPost").attr("action", response.data.MyGateURL);
                        $("#frmPost").submit();
                    })

                .catch((error) => console.log(error));
            } else if (this.selected_payment_method == "MPESA") {
                axios
                    .post("/process_payment/" + this.projectid, {
                        additional_amount: this.selected_reward_custom_amount,
                        payment_method: this.selected_payment_method,
                        total_amount: this.final_amount,
                        email_address: this.email,
                        display_name: this.name,
                        phone_number: this.phone_number,
                        personal_message: this.personal_message,
                        personal_message_name: this.personal_message_name,
                        address_1: this.address_1,
                        city: this.city,
                        country: this.selected_country,
                        postcode: this.postcode,
                        region: this.province,
                        postcode: this.postcode,
                        reward_id: this.reward_id,
                        reward_description: this.reward_description,
                    })
                    .then((response) => {
                        setTimeout(
                            () =>
                            (window.location =
                                "/get_funding_details/" + response.data.funding_record),
                            5000
                        );
                    })
                    .catch((error) => console.log(error));
            } else if (this.selected_payment_method == "EFT") {
                axios
                    .post("/process_payment/" + this.projectid, {
                        additional_amount: this.selected_reward_custom_amount,
                        payment_method: this.selected_payment_method,
                        total_amount: this.final_amount,
                        email_address: this.email,
                        display_name: this.name,
                        phone_number: this.phone_number,
                        personal_message: this.personal_message,
                        personal_message_name: this.personal_message_name,
                        address_1: this.address_1,
                        city: this.city,
                        country: this.selected_country,
                        postcode: this.postcode,
                        region: this.province,
                        reward_id: this.reward_id,
                        reward_description: this.reward_description,
                    })
                    .then((response) => {
                        setTimeout(
                            () =>
                            (window.location =
                                "/get_funding_details/" + response.data.funding_record),
                            5000
                        );
                    })
                    .catch((error) => console.log(error));
            } else {
                alert("Please Pick a valid payment Partner");
            }
        },

        get_currency: function() {
            axios
                .get("/project/get_currency/" + this.projectid)
                .then((response) => {
                    this.currency = response.data.Currency;
                })
                .catch((error) => console.log(error));
        },
        validatePhone: function(value) {
            if (
                /^(?:254|\+254|0)?(7(?:(?:[129][0-9])|(?:0[0-8])|(4[0-1]))[0-9]{6})$/.test(
                    value
                )
            ) {
                this.msg["phone_number"] = "";
            } else {
                this.msg["phone_number"] = "Invalid Kenyan Number";
            }
        },

        setLoaded: function() {
            window.paypal
                .Buttons({
                    createOrder: (data, actions) => {
                        var final = 0;
                        var project_id = this.projectid;
                        var reward_id = this.reward_id
                        var description = this.custom_description;
                        if (this.currency == "KES" || this.currency == "Ksh") {
                            final = parseInt(this.final_amount) * 0.0092;
                        } else if (this.currency == "ZAR" || this.currency == "R") {
                            final = parseInt(this.final_amount) * 0.058;
                        } else if (this.currency == "D" || this.currency == "GMD") {
                            final = parseInt(this.final_amount) * 0.019;
                        } else {
                            final = this.final_amount;
                        }
                        return actions.order.create({
                            purchase_units: [{
                                description: description,
                                amount: {
                                    currency_code: "USD",
                                    value: final.toFixed(2),
                                },


                                custom_id: project_id + "-" + reward_id + "-" + this.address_1 + "-" + this.postcode + "-" + this.city,

                            }, ],
                        });
                    },
                    onApprove: async(data, actions, resp) => {
                        const order = await actions.order.capture();
                        axios
                            .post("/process_paypal_payment/" + this.projectid, {
                                paypal: order,
                                email_address: this.email,
                                display_name: this.name,
                                phone_number: this.phone_number,
                                personal_message: this.personal_message,
                                personal_message_name: this.personal_message_name,
                                reward_id: this.reward_id,
                                reward_description: this.reward_description,
                                delivery_amount: this.selected_reward_shipping_fee,
                                additional_amount: this.selected_reward_custom_amount,
                                address_1: this.address_1,
                                city: this.city,
                                country: this.selected_country,
                                postcode: this.postcode,
                                region: this.province,
                                additional_amount: this.selected_reward_custom_amount,

                            })
                            .then((res) => console.log(res))
                            .catch((error) => console.log(error));

                        window.location.replace("/project_fund_success");
                    },
                    onError: (err) => {
                        console.log(err);
                    },
                })
                .render(this.$refs.paypal);
        },
    },
});

Vue.component("exchange", {
    template: `
  <div>
   <span class="left exchanged-values">
                    &#177; {{ currency_symbol }}
                  </span>

    <span class="right exchanged-values">
                    &#177; {{ currency_symbol }}
                  </span>
  </div>

  `,

    data: function() {
        return {
            country_code: "ZA",
            country_name: "South Africa",
            currency_symbol: "Ksh",
            currency_code: "ZAR",
            currency_name: "Rand",
            base: "ZAR",
            from: "",
            rates: {},
        };
    },
    created() {
        this.getCountry();
    },
    methods: {
        getCountry: function() {
            axios
                .get("/api/detect_country")
                .then(
                    (res) => (
                        (this.country = this.country_code = res.data.country_code),
                        (this.country_name = res.data.country_name),
                        (this.currency_symbol = res.data.currency_symbol),
                        (this.currency_code = res.data.currency_code),
                        (this.currency_name = res.data.currency_name),
                        (this.base = res.data.exchange_rates.base),
                        (this.rates = res.data.exchange_rates.rates),
                        (this.from = res.data.country_code),
                        console.log("country code  in res is", this.from)
                    )
                )
                .catch((error) => console.log(error));
            console.log("country after res  is", this.from);
        },

        exchange_needed: function(from, to) {
            if (from == to) {
                return false;
            }
            return from in fx.rates && to in fx.rates;
        },
    },

    //first get if exchange is needed
    //get country
});

Vue.component("exchange_project", {
    template: `
  <div>
   <span class="exchanged-values">
                    &#177; {{ currency_symbol }}
    </span>

  </div>

  `,

    data: function() {
        return {
            country_code: "ZA",
            country_name: "South Africa",
            currency_symbol: "Ksh",
            currency_code: "ZAR",
            currency_name: "Rand",
            base: "ZAR",
            from: "",
            rates: {},
        };
    },
    created() {
        this.getCountry();
    },
    methods: {
        getCountry: function() {
            axios
                .get("/api/detect_country")
                .then(
                    (res) => (
                        (this.country = this.country_code = res.data.country_code),
                        (this.country_name = res.data.country_name),
                        (this.currency_symbol = res.data.currency_symbol),
                        (this.currency_code = res.data.currency_code),
                        (this.currency_name = res.data.currency_name),
                        (this.base = res.data.exchange_rates.base),
                        (this.rates = res.data.exchange_rates.rates)
                    )
                )
                .catch((error) => console.log(error));
        },

        exchange_needed: function(from, to) {
            if (from == to) {
                return false;
            }

            return from in fx.rates && to in fx.rates;
        },
    },

    //first get if exchange is needed
    //get country
});

Vue.component("exchange_rewards", {
    template: `
  <div>
   <span class="exchanged-values" v-if="exchange_amounts">
                    &#177; {{ currency_symbol }}
    </span>

  </div>

  `,
    props: ["amount", "project_currency"],
    data: function() {
        return {
            country_code: "",
            country_name: "",
            currency_symbol: "",
            currency_code: "",
            currency_name: "",
            base: "",
            rates: {},
            exchange_amounts: false,
        };
    },
    created() {
        this.getCountry();
    },
    mounted: function() {
        this.exchange_needed();
    },
    beforeUpdate: function() {},
    methods: {
        getCountry: function() {
            axios
                .get("/api/detect_country")
                .then(
                    (res) => (
                        (this.country = this.country_code = res.data.country_code),
                        (this.country_name = res.data.country_name),
                        (this.currency_symbol = res.data.currency_symbol),
                        (this.currency_code = res.data.currency_code),
                        (this.currency_name = res.data.currency_name),
                        (this.base = res.data.exchange_rates.base)
                    )
                )
                .catch((error) => console.log(error));
        },

        exchange_needed: function() {
            console.log(this.project_currency);
            if (
                JSON.stringify(this.currency_symbol) ===
                JSON.stringify(this.project_currency)
            ) {
                this.exchange_amounts = false;
            } else {
                this.exchange_amounts = true;
            }
        },
    },

    //first get if exchange is needed
    //get country
});

Vue.component("rewards-fund", {
    template: `
    <div class="col m8 s12">

                    <div class="card fund-project-card" @click.prevent="chooseRe">
                        <div class="card-content fund-project-card-content">
                          <transition enter-active-class="animate__animated animate__bounce" leave-active-class="animate__backOutLeft">
                            <div class="row">
                                <div class="col s1">
                                    <input name="reward" id="reward1" type="radio" class="with-gap" value="1" v-model="checked"/>
                                    <label for="reward"></label>
                                </div>

                                <div class="col s9 m7 l7">
                                    <h5 class="fund-project-reward-title">
                                        Help Fund without recieving a reward
                                    </h5>
                                </div>

                                <div class="clearfix"></div>
                                <div class="col s1 hide-on-small-and-down"></div>
                                <div class="col s11">

                                    <div class="fund-project-custom">Custom Pledge</div>
                                    <div style="display: none;">Country Currency <span id="country"></span> </div>
                                    <div style="display: none;">Exchange Rate <span id="exchange"></span> </div>
                                    <table class="full-width">
                                        <tr>
                                            <td class="project-url-title-parent numeric-prefix">
                                                &nbsp;&nbsp;{{currency}}&nbsp;&nbsp;</td>
                                            <td class="project-url-parent" >
                                                <input onkeypress="return isNumberKey(event)"
                                                        id="amount"
                                                       class="numeric-only clean-border-left"
                                                       style="max-width:200px;"
                                                       type="text"
                                                       v-model="custom_amount"
                                                       @blur="updateRewards"
                                                       /></td>
                                        </tr>
                                    </table>
                                    <div class="exchange-rate-values">
                                        <span class="exchanged-values" >
                                         </span>
                                         <span id="country2"></span>
        <span id="exchange_calc"></span> </div
                                    </div>

                              </div>


                            </div>
                            </transition>
                        </div>
                    </div>
                  <transition-group enter-active-class="animate__animated animate__backInLeft" leave-active-class="animate__backOutLeft">
                    <section class="card fund-project-card" v-for="(reward, index) in rewards" :reward="reward" :key="reward.id" @click.prevent="chooseReward(reward)">
                          <div class="card-content fund-project-card-content" >
                            <div class="row">
                              <div class="col s1">
                                    <input name="reward" id="reward" type="radio" class="with-gap" v-model="checked" :value="reward.id" />
                                    <label for="reward"></label>
                                </div>

                              <div class="col s9 m7 l7">
                                  <h5 class="fund-project-reward-title">
                                      {{ currency }} {{ reward.reward_amount }} - {{ reward.name }}
                                    </h5>
                                    <div class="exchange-rate-values">
                                       <exchange_rewards :amount="reward.reward_amount" :project_currency="currency"></exchange_rewards>
                                    </div>
                              </div>
                              <div class="col s1 m4 l4 hide-on-small-and-down">
                                  <div class="quantity-input-container right">
                                      <div class="subtract-reward-quantity" @click.prevent="reduceQuantity(reward)">
                                          <i class="fa fa-1 fa-minus"></i>
                                      </div>
                                      <div class="reward-quantity-value">{{ reward.quantity }}
                                      </div>
                                        <div class="add-reward-quantity" @click.prevent="addQuantity(reward)">
                                        <i class="fa fa-1 fa-plus"></i>
                                      </div>
                                    </div>
                                </div>

                              <div class="clearfix"></div>
                                    <div class="col s1 hide-on-small-and-down"></div>
                                          <div class="col s11 fund-project-reward-description">

                                            <div class="fund-img-container">
                                                      <img :src="reward.image_url" />
                                            </div>
                                                      <p>
                                                          {{reward.rewarddescription}}

                                                      </p>
                                          </div>
                                <div class="clearfix"></div>

                                <div class="col s1 hide-on-small-and-down"></div>
                                <!-- web based -->
                                <div class="col s12 card-action fund-project-stats-parent hide-on-small-only">

                                      <div class="col 12 fund-project-stats-sub-parent">
                                          <div>
                                              <i class="fa fa-calendar fund-project-stats-icon"></i>
                                              <span class="fund-project-stats">Estimated: {{ reward.delivery_date }}</span>
                                          </div>
                                          <div>
                                              <i class="fa fa-truck fund-project-stats-icon" v-show="reward.shipping_details=='intl' || reward.shipping_details=='local'"></i>
                                              <span class="fund-project-stats" v-show="reward.shipping_details=='intl'">World Wide Delivery</span>
                                              <span class="fund-project-stats"  v-show="reward.shipping_details=='local'">Delivery To South Africa Only</span>
                                          </div>
                                          <div>
                                              <span class="fund-project-stats" v-show="reward.limit_reward_amount == true">{{ reward.remaining_quantity }} left of {{reward.limit_reward_quantity}}</span>
                                          </div>
                                      </div>
                                  </div>
                                <!-- mobile based -->

                                <div style="padding:0" class="col s12 card-action fund-project-stats-parent show-on-small hide-on-med-and-up fund-project-mobile-summary">

                                  <div class="col s6 center-text">
                                      <span class="fund-project-stats-mobile">Estimated: {{ reward.delivery_date }}</span>
                                  </div>
                                  <div class="col s6 center-text" >
                                    <span class="fund-project-stats" v-show="reward.shipping_details=='intl'">World Wide Delivery</span>
                                              <span class="fund-project-stats"  v-show="reward.shipping_details=='local'">Delivery To South Africa Only</span>
                                  </div>
                                </div>


                            </div>

                            <!-- extra amount -->
                            <div class="card-action fund-project-additional-amount-parent hide-on-small-and-down">
                              <div class="col s1"></div>
                                  <div class="col s11" style="padding: 10px 0 0 0;" v-if="!reward.additionalAmount">
                                      Want to give more? <br />
                                  <a href="#" @click.prevent="showAdditionalAmount(reward)"
                                    class="waves-effect waves-light btn-flat orange-text add-additional-amount">
                                    <i class="fa fa-1 fa-plus"></i>
                                    <strong> Additional Amount</strong>
                                  </a>

                              </div>

                              <div class="col s11" v-else>

                                  <div class="row">
                                    <div class="col s9">
                                      <input name="additional_Amount"
                                      onkeypress="return isNumberKey(event)"
                                        id="additional_Amount"
                                        v-model="reward.custom_amount"
                                        @blur="addAdditionalAmount(reward);"
                                        type="text"
                                      />
                                      <div class="exchange-rate-values">
                                        <span class="exchanged-values absolute">
                                          &#177;
                                        </span>
                                      </div>
                                      <label class="additional-amount-label" for="additionalAmount"
                                      >
                                      </label>
                                    </div>

                                    <div class="col s3">
                                      <button class="waves-effect waves-light btn right"
                                        type="button"
                                        @click.prevent="removeAdditionalAmount"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>

                              </div>
                            </div>

                            <div class="clearfix"></div>

                          </div>

                  </section>
                  </transition-group>



</div>
`,
    import: { eventBus },
    props: {
        projectid: {
            type: String,
        },
    },
    data: function() {
        return {
            rewards: [],
            custom_reward_amount: "",
            custom_description: "Pledge without receving a reward",
            custom_amount: 0,
            final_amount: "",
            custom_amount_reward: 0,
            currency: "",
            chosen: "",
            checked: "",
            country_name: "",
            reward: [],
            project_country: "",
        };
    },
    created: function() {
        this.getRewards();
        this.get_currency();
        const reward = $("#d_elem").val();
        this.checked = reward;
    },

    mounted() {
        if (this.checked == 1) {} else {
            this.getReward(this.checked);
        }
        this.getCountry();
        this.getProjectCountry();
    },
    methods: {
        getCountry: function() {
            axios
                .get("/api/detect_country")
                .then(
                    (res) => (
                        (this.country_name = res.data.country_name),
                        console.log("country name", this.country_name)
                    )
                )
                .catch((error) => console.log(error));

        },
        getRewards: function() {
            axios
                .get("/project/get_rewards/" + this.projectid)
                .then((res) => {
                    const data = res.data;
                    for (let key in data) {
                        const reward = data[key];
                        reward["quantity"] = 1;
                        reward["additionalAmount"] = false;
                        reward["custom_amount"] = 0;
                        this.rewards.push(reward);
                    }
                })
                .catch((error) => console.log(error));
        },
        getReward: function(id) {
            axios
                .get("/project/get_reward/" + id)
                .then((res) =>
                    this.$emit("amountwasreset", parseInt(res.data[0]["reward_amount"]))
                )
                .catch((error) => console.log(error));
        },
        updateRewards: function() {
            this.final_amount = parseInt(this.custom_amount);
            this.$emit("amountwasreset", this.final_amount);
            eventBus.$emit("rewardchosen", this.custom_description);
            eventBus.$emit("rewardid", 1);
        },
        chooseRe: function() {
            this.checked = 1;
            this.final_amount = parseInt(this.custom_amount);
            this.$emit("amountwasreset", this.final_amount);
            eventBus.$emit("requiresshipping", false);
            eventBus.$emit("rewardchosen", "Help Fund without recieving a reward");
            this.$emit("rewardwasreset", this.checked);
        },
        get_currency: function() {
            axios
                .get("/project/get_currency/" + this.projectid)
                .then((response) => {
                    this.currency = response.data.Currency;
                })
                .catch((error) => console.log(error));
        },
        addAdditionalAmount: function(reward) {
            this.final_amount += parseInt(reward.custom_amount);
            this.$emit("amountwasreset", this.final_amount);
            eventBus.$emit("customamount", reward.custom_amount);
        },
        reduceQuantity: function(reward) {
            if (reward.quantity == 1) {
                alert("Reward cannot be less than 1 unit");
            } else {
                reward.quantity -= 1;
                this.final_amount =
                    parseInt(reward.reward_amount) * parseInt(reward.quantity);
                eventBus.$emit("quantitychanged", reward.quantity);
            }
        },
        addQuantity: function(reward) {
            reward.quantity += 1;
            this.final_amount =
                parseInt(reward.reward_amount) * parseInt(reward.quantity);
            eventBus.$emit("quantitychanged", reward.quantity);
        },
        showAdditionalAmount: function(reward) {
            reward.additionalAmount = true;
        },
        changeQuantity: function() {
            this.total_amount += parseInt(this.custom_amount_reward);
        },
        removeAdditionalAmount: function() {
            this.total_amount =
                this.total_amount - parseInt(this.custom_amount_reward);
            this.custom_amount = 0;
            this.additionalAmount = false;
        },
        getProjectCountry: function() {
            axios
                .get("/api/get_project_country/" + this.projectid)
                .then((res) => (this.project_country = res.data))
                .catch((error) => console.log(error));
            console.log("country after res  is", this.from);
        },
        chooseReward: function(reward) {
            this.checked = reward.id;
            eventBus.$emit("rewardchosen", reward.description);
            eventBus.$emit("rewardid", reward.id);
            if (reward.shipping_details != "none") {
                eventBus.$emit("requiresshipping", true);
                if (reward.shipping_details == "local") {
                    this.final_amount =
                        parseInt(reward.reward_amount) * parseInt(reward.quantity) +
                        parseInt(reward.custom_amount) +
                        parseInt(reward.local_shipping_cost);
                    eventBus.$emit("shippingamount", reward.local_shipping_cost);
                } else if (reward.shipping_details == "intl") {
                    if (this.project_country === this.country_name) {
                        this.final_amount =
                            parseInt(reward.reward_amount) * parseInt(reward.quantity) +
                            parseInt(reward.custom_amount) +
                            parseInt(reward.local_shipping_cost);
                        eventBus.$emit("shippingamount", reward.local_shipping_cost);
                    } else {
                        this.final_amount =
                            parseInt(reward.reward_amount) * parseInt(reward.quantity) +
                            parseInt(reward.custom_amount) +
                            parseInt(reward.intl_shipping_cost);
                        eventBus.$emit("shippingamount", reward.intl_shipping_cost);
                    }
                }
            } else {
                eventBus.$emit("requiresshipping", false);
                this.final_amount =
                    parseInt(reward.reward_amount) * parseInt(reward.quantity) +
                    parseInt(reward.custom_amount);
            }
            eventBus.$emit("customamount", reward.custom_amount);
            this.$emit("amountwasreset", parseInt(this.final_amount));
            this.$emit("rewardwasreset", this.checked);
        },
        updateReward: function(reward) {
            this.final_amount = parseInt(reward.reward_amount);
            this.$emit("amountwasreset", this.final_amount);
        },
    },
});

Vue.component("project-image", {
    template: `
    <div id="project-photo-upload">
      <div class="dropzone dz-clickable" id="dropzoneDiv">
        <div class="dz-message">
          <i class="fas fa-cloud-upload-alt"></i>
            <br/>
              Drag and drop your image here<br/>
              or <span class="linktext">browse your computer</span><br/>
              <span class="linksmalltext">
                (Best size: 387 x 250px. Image format: .JPG)
              </span>
        </div>
      </div>
    </div>

                                            `,
});

Vue.component("social-links", {
    template: `
<li class="collection-item item-details-parent">
                                    <div class="row item-details-row">
                                        <div class="input-field col m9 s12 item-parent">
                                            <p class="item-name">
                                                Paste any link here...
                                            </p>

                                            <input id="linknew" type="text" v-model="linknew"/>
                                        </div>

                                        <div class="input-field col m3 s12 item-parent">
                                            <a class="btn waves-effect waves-light orange add-link-button"
                                               @click.prevent="addLink()">Add Link</a>
                                        </div>
                                    </div>

                                    <div class="row item-details-row">
                                        <div class="input-field col s9 item-parent">

                                            <div v-for="(link, index) in links" :link="link" :key="link.id">
                                                <table class="social-links-parent">
                                                    <tr class="social-links-tr"
                                                        onmouseover="$(this).find('td:nth-child(3)').show();"
                                                        onmouseout="$(this).find('td:nth-child(3)').hide();">

                                                        <td class="social-links-image-parent">
                                                            <img class="social-links-icon" src="/static/img/icon/link.svg"/>

                                                        </td>
                                                        <td class="social-links-url-parent no-padding">
                                                            <p class="social-links-url url-truncate">
                                                                {{ link.link }}
                                                            </p>
                                                        </td>
                                                        <td class="social-links-url-delete" style="display:none;">
                                                            <img src="/static/img/delete.svg" class="edit-icon social-links-delete"
                                                                 @click.prevent="deleteSocials(link)"/>
                                                        </td>

                                                    </tr>
                                                </table>
                                            </div>

                                        </div>
                                    </div>
                                </li>

  `,
    props: ["projectid"],
    data() {
        return {
            linknew: "",
            links: [],
        };
    },
    mounted() {
        this.getSocialLinks();
    },
    methods: {
        addLink: function() {
            axios
                .post("/my_project/social/" + this.projectid, {
                    link: this.linknew,
                })
                .then((response) =>
                    this.links.push({
                        id: response.data.link.id,
                        link: response.data.link.link,
                        created_on: response.data.link.created_on,
                    })
                )
                .catch((error) => console.log(error.response.data));
            this.linknew = "";
        },
        removerows: function(index) {
            this.links.splice(index, 1);
        },

        getSocialLinks() {
            axios
                .get("/my_project/get_socials/" + this.projectid)
                .then((res) => {
                    const data = res.data;
                    for (let key in data) {
                        const social = data[key];
                        this.links.push(social);
                    }
                })
                .catch((error) => console.log(error));
        },
        deleteSocials(link) {
            axios
                .get("/my_project/delete_social/" + link.id)
                .then((response) => {
                    this.removerows(link.index);
                })
                .catch((error) => console.log(error.response));
        },
    },
});

Vue.component("reset-password", {
    template: `
  <div class="container parent-container-top full-width">
  <section class="section-parent">
    <h4 class="section-header1 hidden">Forgot Password</h4>

    <ul
      onclick="toggleSelected(this);"
      onmouseout="removeShadow(this);"
      onmouseover="toggleShadow(this);"
      class="collection with-header tab-hover collection-parent collection-selected"
    >
      <li id="register_sub_title" class="collection-header item-header">
        Forgot Password
      </li>
      <li class="collection-item item-details-parent">
        <form role="form">
          <div class="row item-details-row">
            <div class="input-field col s12 item-parent">
              <p class="item-name">Email</p>

              <input
                maxlength="60"
                name="email"
                type="email"
                placeholder=""
                required="true"
                v-model="emailAddress"
              />
              <span class="error-message"></span>
            </div>
          </div>

          <div class="row item-details-row">
            <div class="input-field col s12 item-parent center-text">
              <button @click.prevent="sendData"
                class="waves-effect waves-light btn-large white-text sign-up-button"
                type="submit"
              >
                Forgot Password
              </button>
            </div>
          </div>
        </form>

        <div
          class="row item-details-row"

          style="margin-top: 20px;" v-if="email_sent"
        >
          <i class="fa fa-check"></i> We've sent an email to
          <b>{{ emailAddress }}</b> with instructions to reset your password.
        </div>
      </li>
    </ul>
  </section>
</div>`,
    data: function() {
        return {
            emailAddress: "",
            email_sent: false,
            success: false,
        };
    },
    methods: {
        sendData: function() {
            axios
                .post("/forgotpassword", {
                    email_address: this.emailAddress,
                })
                .then(function(response) {
                    this.success = response.data.message;
                })
                .catch(function(error) {
                    console.log(error);
                });

            if ((this.success = true)) {
                this.email_sent = true;
            }
        },
    },
});

Vue.component("new-password", {
    template: `
<div class="container parent-container-top full-width">
  <section class="section-parent">
    <h4 class="section-header1 hidden">Reset Password</h4>

    <ul
      onclick="toggleSelected(this);"
      onmouseout="removeShadow(this);"
      onmouseover="toggleShadow(this);"
      class="collection with-header tab-hover collection-parent collection-selected"
    >
      <li class="collection-header item-header">Reset Password</li>
      <li class="collection-item item-details-parent">
        <form role="form">
          <div class="row item-details-row">
            <div class="input-field col s12 item-parent">
              <p class="item-name">New Password</p>

              <input
                maxlength="60"
                name="password"
                id="password"
                type="password"
                placeholder=""
                required="true"
                v-model="password"
              />

              <p onclick="passwordToText(this)" class="login-show-password">
                Show
              </p>

              <span class="error-message"></span>
            </div>
          </div>

          <div class="row item-details-row">
            <div class="input-field col s12 item-parent center-text">
              <button @click="reset"
                class="waves-effect waves-light btn-large white-text sign-up-button"
                type="submit"
              >
                Reset Password
              </button>
            </div>
          </div>
        </form>

        <div
          class="row item-details-row"
          style="margin-top: 20px;"
          v-if="success"
        >
          <i class="fa fa-check"></i> Your new password has been saved. Please
          wait a moment while we log you in.
        </div>
      </li>
    </ul>
  </section>
</div>;`,
    data: function() {
        return {
            password: "",
            changed: false,
            success: false,
        };
    },
    methods: {
        sendData: function() {
            axios
                .post("/forgotpassword", {
                    email_address: this.emailAddress,
                })
                .then(function(response) {
                    this.success = response.data.message;
                })
                .catch(function(error) {
                    console.log(error);
                });

            if ((this.success = true)) {
                this.email_sent = true;
            }
        },
    },
});

Vue.component("rewards", {
    template: `
<div>
                            <div v-for="(reward,index) in rewards" :reward="reward" :key="reward.id">

                                <ul onclick="toggleSelected(this); return true;"
                                    class="collection with-header inactive-tab collection-parent collection-unselected">

                                    <li class="collection-header item-header">
                                        <span class="pointer edit-reward-name"
                                              onmouseover="$(this).children('img').show();"
                                              onmouseout="$(this).children('img').hide();"
                                              onclick="$(this).hide(); $(this).siblings('input').show(); $(this).siblings('a').show(); $(this).siblings('span').hide();">
                                            Rewards here
                                            <img id="reward-edit-icon" src="/static/img/edit.svg" class="reward-name-edit"/>
                                        </span>

                                        <input id="reward_name" type="text" name="reward_name" class="reward-name-input" v-model="reward.name" placeholder="New Reward"
                                               style="padding-left:10px !important; height:35px; width:250px; padding-top:0 !important; padding-bottom:0 !important;"
                                             init-focus/>



                                        <span id="span-reward_name" class="error-message reward-delete-link"
                                              style="display:inline;"
                                              @click="rewardDelete(reward, index)">Delete
                                        </span>
                                    </li>

                                    <li class="collection-item item-details-parent">



                                        <div class="row item-details-row">
                                            <div class="input-field col m5 s12 item-parent">

                                                <p class="item-name">Pledge Amount&nbsp;&nbsp;&nbsp;&nbsp;<img
                                                        onclick="Materialize.toast('The amount that the backer must pledge to receive this reward', 4000);"
                                                        class="info-icon"
                                                        src="/static/img/info.svg"/></p>

                                                <table class="full-width">
                                                    <tr>
                                                        <td class="project-url-title-parent numeric-prefix">&nbsp;&nbsp;{{ reward.reward_currency }}&nbsp;&nbsp;</td>
                                                        <td class="project-url-parent">
                                                            <input placeholder="Min. of $1" required="true"
                                                                   min="true"
                                                                   min_amount="1"
                                                                   class="numeric-only clean-border-left"

                                                                   id="reward_amount" type="number" name="reward_amount"
                                                                   format="number"
                                                                   v-model="reward.reward_amount"/></td>
                                                    </tr>
                                                </table>

                                                <span class="error-message"></span>

                                                <p class="item-name">Delivery Date&nbsp;&nbsp;&nbsp;&nbsp;<img
                                                        onclick="Materialize.toast('The date that the reward will be delivered to the backer', 4000);"
                                                        class="info-icon" src="/static/img/info.svg"/></p>

                                                <table class="delivery-date-table" style="width:104%;">
                                                    <tr>
                                                        <td class="no-padding-margin">
                                                            <select required="true"
                                                                    name="delivery_date"
                                                                    v-model="reward.delivery_date"
                                                                    id="delivery_date" class="browser-default">

                                                                    <option value="January, 2021">January, 2021</option>
                                                                    <option value="February, 2021">February, 2021</option>
                                                                    <option value="March, 2021">March, 2021</option>
                                                                    <option value="April, 2021">April, 2021</option>
                                                                    <option value="May, 2021">May, 2021</option>
                                                                    <option value="June, 2021">June, 2021</option>
                                                                    <option value="July, 2021">July, 2021</option>
                                                                    <option value="August, 2021">August, 2021</option>
                                                                    <option value="September, 2021">September, 2021</option>
                                                                    <option value="October, 2021">October, 2021</option>
                                                                    <option value="November, 2021">November, 2021</option>
                                                                    <option value="December, 2021">December, 2021</option>
                                                                    <option value="January, 2022">January, 2021</option>
                                                                    <option value="February, 2022">February, 2022</option>
                                                                    <option value="March, 2022">March, 2022</option>
                                                                    <option value="April, 2022">April, 2022</option>
                                                                    <option value="May, 2022">May, 2022</option>
                                                                    <option value="June, 2022">June, 2022</option>
                                                                    <option value="July, 2022">July, 2022</option>
                                                                    <option value="August, 2022">August, 2022</option>
                                                                    <option value="September, 2022">September, 2022</option>
                                                                    <option value="October, 2022">October, 2022</option>
                                                                    <option value="November, 2022">November, 2022</option>
                                                                    <option value="December, 2022">December, 2022</option>
                                                            </select>
                                                        </td>

                                                    </tr>
                                                </table>

                                                <p class="item-name">Shipping Details</p>

                                                <table class="delivery-date-table" style="width:104%;">
                                                    <tr style="width:100%;margin:0 !important; padding:0 !important;">
                                                        <td style="width:100%;margin:0 !important; padding:0 !important;">

                                                            <select style="width:100%;margin:0 !important; padding:0 !important;"
                                                                    id="shipping_details"
                                                                    name="shipping_details"
                                                                    v-model="reward.shipping_details"
                                                                    class="browser-default no-padding-margin">
                                                                <option value="none" selected>None</option>
                                                                <option value="local">Only ships locally
                                                                </option>
                                                                <option value="intl">Ship worldwide</option>
                                                                </option>
                                                            </select>

                                                        </td>
                                                    </tr>
                                                </table>

                                               <div v-if="reward.shipping_details == 'local'"
                                                     class="input-field item-parent">

                                                    <p class="item-name reward-shipping-cost">Local
                                                        Shipping Cost

                                                        &nbsp;&nbsp;

                                                        <img onclick="Materialize.toast('This is the shipping cost of the reward', 4000);"
                                                             class="info-icon" src="/static/img/info.svg"/></p>

                                                    <table class="full-width">
                                                        <tr>
                                                                <td class="project-url-title-parent numeric-prefix">&nbsp;&nbsp;{{ reward.reward_currency }}&nbsp;&nbsp;</td>
                                                            <td class="project-url-parent">
                                                                <input placeholder=""
                                                                       onkeypress="return isNumberKey(event);"
                                                                       class="numeric-only clean-border-left shipping-cost"

                                                                       id="local_shipping_cost" type="number"
                                                                       format="number"
                                                                       v-model="reward.local_shipping_cost"/>
                                                            </td>
                                                        </tr>
                                                    </table>

                                                </div>

                                                <div class="input-field item-parent" v-if="reward.shipping_details == 'intl'" >

                                                    <p class="item-name reward-shipping-cost">Local
                                                        Shipping Cost

                                                        &nbsp;&nbsp;

                                                        <img onclick="Materialize.toast('This is the shipping cost of the reward', 4000);"
                                                             class="info-icon" src="/static/img/info.svg"/></p>

                                                    <table class="full-width">
                                                        <tr>
                                                                <td class="project-url-title-parent numeric-prefix">&nbsp;&nbsp;{{ reward.reward_currency }}&nbsp;&nbsp;</td>
                                                            <td class="project-url-parent">
                                                                <input placeholder=""
                                                                       onkeypress="return isNumberKey(event);"
                                                                       class="numeric-only clean-border-left shipping-cost"

                                                                       id="local_shipping_cost" type="number"
                                                                       format="number"
                                                                       v-model="reward.local_shipping_cost"/>
                                                            </td>
                                                        </tr>
                                                    </table>

                                                </div>

                                                <div v-show="reward.shipping_details == 'intl'"
                                                     class="input-field item-parent">

                                                    <p class="item-name reward-shipping-cost">International Shipping Cost

                                                        &nbsp;&nbsp;

                                                        <img onclick="Materialize.toast('This is the shipping cost of the reward', 4000);"
                                                             class="info-icon" src="/static/img/info.svg"/></p>

                                                    <table class="full-width">
                                                        <tr>
                                                            <td class="project-url-title-parent numeric-prefix">&nbsp;&nbsp;{{ reward.reward_currency }}&nbsp;&nbsp;</td>
                                                            <td class="project-url-parent">
                                                                <input placeholder=""
                                                                       onkeypress="return isNumberKey(event);"
                                                                       class="numeric-only clean-border-left shipping-cost"
                                                                       id="intl_shipping_cost" type="number"
                                                                       format="number"
                                                                       v-model="reward.intl_shipping_cost"/>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </div>

                                            </div>

                                            <div class="input-field col m6 s12 item-parent">
                                                <p class="item-name">Description&nbsp;&nbsp;<img
                                                        onclick="Materialize.toast('An explanation of the reward and its features', 4000);"
                                                        class="info-icon" src="/static/img/info.svg"></p>

                                                <textarea class="reward-description"
                                                        onblur="inputValidator(this, false);"

                                                          v-model="reward.rewarddescription" placeholder=""
                                                         id="reward-description" name="reward-description"
                                                          required="true"></textarea>
                                                <span class="error-message"></span>

                                                <p class="item-name reward-shipping-cost">Optional Image</p>

                                                <div :id="reward.id + '-upload'"
                                                     style="width:100% !important;margin:0 !important;max-height:100px;">

                                                    <form :id="'teamPhotoDropzone-'+ reward.id"
                                                          class="dropzone dz-clickable"
                                                          method="POST" v-bind:onclick="'reward('+reward.id+')'"
                                                          role="form"
                                                          style="width:105% !important;margin:0 !important;max-height:100px;"
                                                          enctype="multipart/form-data"
                                                          :action="'/my_project/update_rewards_image/'+reward.reward_id">

                                                        <div class="dz-message" style="margin:8px;font-size:12px;">
                                                            <img src="/static/img/image.svg" style="max-width:50px;"/>
                                                            <br>
                                                            Drag and drop your image here<br>or <span class="linktext">browse your computer</span>
                                                        </div>
                                                    </form>
                                                </div>


                                                <img style="text-align: center;margin-left:auto;margin-right:auto;"
                                                     :id="reward.id"
                                                     :src="reward.image_url"
                                                     onload="return imageOnSuccess(this);"
                                                     onerror="return imageOnError(this);"
                                                     class="reward-image-preview"/>

                                                <span style="clear:both" id="1-delete"
                                                      class="error-message image-remove-link"
                                                      >Remove Image</span>

                                            </div>


                                            <div class="input-field col m12 s12 item-parent" style="margin-top:10px;" @click="limitRewards(reward)">

                                                <input type="checkbox" v-model="reward.limit_reward_amount" :id="reward.id" name="reward.id" :value="reward.limit_reward_amount"/>
                                                <label for="limit_reward_amount" style="color: #124048 "
                                                       class="item-name">Limit quantity of this reward</label>

                                            </div>
                                            <div v-show="reward.limit_reward_amount"
                                                 class="input-field col m6 s12 item-parent">

                                                <p class="item-name">Quantity Available&nbsp;&nbsp;<img
                                                        onclick="Materialize.toast('The number of rewards avalailable to be claimed', 4000);"
                                                        class="info-icon" src="/static/img/info.svg"></p>

                                                <input class="numeric-only"
                                                       onkeypress="return isNumberKey(event);"

                                                       onblur="inputValidator(this, false);"
                                                       id="reward_quantity" type="text"
                                                       v-model="reward.limit_reward_quantity"/>

                                            </div>


                                        </div>


                                    </li>


                                    <li class="collection-header item-footer hidden">
                                        <img src="/static/img/info-blue.svg" class="info-icon-left"/>

                                        <p id="description_reward" class="description"><b>Remember:</b><br>- You
                                            can’t offer one
                                            of these<a
                                                    href="https://blog.thundafund.com/crowdfunding/ready-for-crowdfunding/part-2-your-project/#Prohibited"
                                                    target="_blank"> prohibited items</a> as a reward <br>- Add at least 3
                                            rewards <br>-
                                            The minimum required pledge amount is $10 <br>- Most popular pledge amount is
                                            $30 <br>-
                                            Include fees for rewards delivered in South Africa
                                        </p>

                                        <p id="description_reward_auxiliary_pledge"
                                           class="description reward-footer-description"><b>Pledge Amount:</b><br>-This is
                                            the amount
                                            your backers will pledge towards your campaign when they select this reward. The
                                            minimum
                                            pledge amount is $10.</p>

                                        <p id="description_reward_auxiliary_delivery_date"
                                           class="description reward-footer-description"><b>Delivery Date:</b><br>-This is
                                            the date you
                                            expect to send the rewards to your backers. If the reward includes multiple
                                            items, choose
                                            the date you expect the final item to be delivered.</p>

                                        <p id="description_reward_auxiliary_description"
                                           class="description reward-footer-description"><b>Description:</b><br>-Write a
                                            short and
                                            punchy description. Explain how your backers will receive this reward and
                                            whether there are
                                            any delivery restrictions, for example: 'Must be able to travel to Cape Town
                                            city center'
                                        </p>

                                        <p id="description_reward_auxiliary_quantity"
                                           class="description reward-footer-description"><b>Quantity Available:</b><br>- If
                                            you only
                                            have a limited amount of items available for a particular reward, you can set it
                                            here. Once
                                            this limit is reached, backers wont be able to choose this reward anymore.</p>

                                        <p id="description_reward_auxiliary_international_shipping"
                                           class="description reward-footer-description"><b>International Shipping:</b><br>-If
                                            you want
                                            to ship a reward to other countries, you can add an international shipping fee
                                            to cover your
                                            costs. You can leave this blank if you only deliver in South Africa.</p>

                                        <p><a href="https://thundafund.com/StaticPages/FAQ.aspx#rewards" target="_blank">Read
                                            more</a>
                                            about the different types of rewards you can give...</p>

                                        <p class="item-info-footer"></p>
                                    </li>

                                </ul>

                            </div>

                            <ul v-on:click.prevent="newRewardClick()"

                                onmouseout="removeShadow(this);"
                                onmouseover="toggleShadow(this);"
                                class="collection with-header inactive-tab collection-parent collection-unselected">
                                <li class="collection-item item-details-parent item-new-reward">
                                    <img src="/static/img/add.svg" class="add-reward-icon" />Add New Reward
                                </li>
                            </ul>

                            <ul class="next-button-parent">
                                    <li>
                                        <a class="waves-effect waves-light btn-large orange white-text"
                                            @click.prevent ="rewardUpdate"
                                           onclick="return validateForm(3, true);"

                                           >
                                            Save &amp; Continue
                                            <img class="next-button-arrow" src="/static/img/right-arrow.svg"/>
                                        </a>
                                    </li>
                                </ul>
</div>
`,
    props: ["projectid"],
    data: function() {
        return {
            rewards: [],
            custom_amount: 0,
            quantity: 1,
            additionalAmount: false,
            total_amount: 25,
            final_amount: "",
            custom_amount_reward: 0,
            currency: "",
        };
    },
    created() {
        this.getRewards();
    },
    methods: {
        limitRewards: function(reward) {
            if (reward.limit_reward_amount == true) {
                reward.limit_reward_amount = false;
            } else {
                reward.limit_reward_amount = true;
            }
        },
        getRewards: function() {
            axios
                .get("/project/get_rewards/" + this.projectid)
                .then((res) => {
                    const data = res.data;
                    for (let key in data) {
                        const reward = data[key];
                        if (reward.limit_reward_amount == 1) {
                            console.log(reward);
                        }
                        this.rewards.push(reward);
                    }
                })
                .catch((error) => console.log(error));
        },
        newRewardClick: function() {
            axios
                .post("/my_project/new_reward/" + this.projectid, {})
                .then((response) =>
                    this.rewards.push({
                        reward_currency: response.data.curr,
                        id: response.data.desc,
                        name: "",
                        reward_amount: "",
                        delivery_date: "",
                        shipping_details: "",
                        local_shipping_cost: "",
                        intl_shipping_cost: "",
                        reward_photo_upload: "",
                        limit_reward_amount: false,
                        reward_quantity: "999",
                        rewarddescription: "",
                    })
                )
                .catch((error) => console.log(error.response.data));
            console.log(this.rewards);
        },

        rewardUpdate: function() {
            for (let key in this.rewards) {
                let obj = this.rewards[key];
                console.log(obj);
                axios
                    .post("/my_project/update_rewards/" + obj.id, {
                        reward_amount: parseInt(obj.reward_amount),
                        name: obj.name,
                        delivery_date: obj.delivery_date,
                        shipping_details: obj.shipping_details,
                        local_shipping_cost: obj.local_shipping_cost,
                        intl_shipping_cost: obj.intl_shipping_cost,
                        limit_reward_amount1: obj.limit_reward_amount1,
                        reward_quantity: obj.reward_quantity,
                        rewarddescription: obj.rewarddescription,
                    })
                    .then(this.onSuccess)
                    .catch((error) => console.log(error.response.data));
            }
        },

        removerows: function(index) {
            this.rewards.splice(index, 1);
        },
        rewardDelete(reward, index) {
            axios
                .get("my_project/delete_reward/" + reward.id)
                .then((response) => {
                    this.removerows(index);
                })
                .catch((error) => console.log(error.response.data));
        },

        onSuccess(response) {
            console.log(response.data);
        },
        reward: function(id) {
            console.log(id);
        },
    },
});

Vue.component("rewards-project", {
    template: `
  <div class="col m4 s12 right">
                <h5 class="project-header">Rewards</h5>
                <transition-group enter-active-class="animate__animated animate__backInRight" leave-active-class="animate__backOutLeft">
                  <div class="card-panel reward-card" v-for="(reward, index) in rewards" :reward="reward" :key="reward.id">
                    <div @click.prevent="buyReward(projectid, reward)">
                        <img style="text-align: center;margin-left:auto;margin-right:auto;" :src="reward.image_url"
                             class="reward-image-project-view"/>

                        <div class="reward-details">
                            <span class="left"><strong>{{ reward.reward_currency }}{{ reward.reward_amount }}</strong></span>
                            <span class="right reward-quantity-text" v-if="reward.limit_reward_amount == 1">{{ reward.remaining_quantity }} left of {{reward.limit_reward_quantity }}</span>
                           <!--<span class="right" v-if="reward.reward_quantity == ''"><strong>Unlimited</strong></span>-->
                            <div class="clearfix"></div>
                            <!--<div class="exchange-rate-values">
                                <span
                                        class="exchanged-values">
                                    &#177;
                                </span>
                            </div>-->
                        </div>

                        <div class="reward-description-text">
                            <strong>{{ reward.name }}</strong>

                            <p>{{ reward.rewarddescription }}</p>

                        </div>

                        <div class="reward-footer">
                            <div class="col m7">
                                <p><strong>Est. delivery date:</strong></p>

                                <p>{{ reward.delivery_date }}</p>
                            </div>
                            <div class="col m5" v-show="reward.shipping_details == 'local'">
                                <p><strong>Delivery:</strong></p>

                                <p>Local</p>

                             </div>
                            <div class="col m5" v-show="reward.shipping_details == 'intl'">
                                <p><strong>Delivery:</strong></p>

                                <p>Worldwide</p>
                            </div>
                            <div class="clearfix"></div>
                        </div>
                    </div>
                </div>
              </transition-group>
        </div>

</div>
  `,
    import: { eventBus },
    props: ["projectid"],
    data: function() {
        return {
            rewards: [],
            currency: "",
        };
    },
    created() {
        this.getRewards();
        this.currency = $("#d_elem").val();
    },

    methods: {
        getRewards: function() {
            axios
                .get("/project/get_rewards/" + this.projectid)
                .then((res) => {
                    console.log(res);
                    const data = res.data;
                    for (let key in data) {
                        const reward = data[key];
                        reward["quantity"] = 1;
                        // temporary fix
                        // to be removed
                        if(this.projectid !== 6716626611211053 && reward.id !== 6526419964267622){
                            this.rewards.push(reward);
                        }
                    }
                    console.log(this.rewards, 'i get them here');
                })
                .catch((error) => console.log(error));
        },
        buyReward: function(pid, reward) {
            const rid = reward.id
            const diff = new Date(reward.project_end_date) - new Date(new Date().toUTCString())
            const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
            if (reward.project_status === 3 && diffDays > 0) {
                eventBus.$emit("rewardwasreset", rid);
                window.location.href = "https://payments.thundafund.com/" + pid + `?reward=${rid}`;
            }
        },
    },
});

Vue.component("tabs", {
        template: `
  <div>
      <a name="long-story"></a>
        <h5 class="project-header project-tab-1 left active_tab"

        @click="switchTabs('hello')"
        >
          The Project
        </h5>
        <h5 class="project-header project-tab-2 left"
        @click="switchTabs('world')"
        >
          Comments: ({{comments}})
        </h5>
        <div class="clearfix"></div>

        <div class="card-panel long-story-container" v-if="isHelloActive">
          <p v-html="long_story"> </p>
        </div>
        <div class="card-panel long-story-container" v-if="isWorldActive">

          <table class="bordered supporters-table" v-if="comments > 0">
            <tbody>
                        <tr v-for="supporter in funders_list">
                            <td>{{ supporter.display_name }}</td>
                            <td>{{ supporter.personal_message }}</td>
                            <td>R{{ supporter.total_amount}}</td>
                        </tr>
            </tbody>
          </table>
          <p v-else>No personal comments as of yet.</p>
        </div>
  </div>
   `,
        props: ["projectid"],
        data: function() {
            return {
                currency: "",
                long_story: "",
                funders_list: [],
                comments: "",
                isHelloActive: true,
                isWorldActive: false,
            };
        },
        mounted() {
            this.getLongStory();
            this.getComments();
            this.currency = $("#d_elem").val();
        },
        methods: {
            switchTabs(tab) {
                if (tab === "hello") {
                    this.isHelloActive = true;
                    this.isWorldActive = false;
                } else {
                    this.isHelloActive = false;
                    this.isWorldActive = true;
                }
            },
            getLongStory() {
                axios.get("/api/get_long_story/" + this.projectid)
                    .then((response) => {
                        this.long_story = response.data.Project;
                    })
                    .catch((error) => console.log(error));
            },
            getComments() {
                axios.get("/api/project_comments/" + this.projectid)
                    .then((response) => {
                        this.comments = response.data.Comments.length;
                        const data = response.data.Comments;
                        for (let key in data) {
                            const comments = data[key];
                            this.funders_list.push(comments);
                        }

                    })
                    .catch((error) => console.log(error));
            }

        }
    }),

    new Vue({
        el: "#app",
        data: {
            linknew: "",
            sociallinks: [],
            rewards: [],
            long_story: "",
            additionalAmount: false,
            projectid: "",
            checked: 1,
            final_amount: 0,
            isHelloActive: true,
            isWorldActive: false,
        },

        created() {
            var projectId = document.getElementById("project-id").getAttribute("value");
            this.projectid = projectId;
        },
        methods: {
            addReward: function(id) {
                axios
                    .post("/my_project/new_reward/" + id)
                    .then(this.onSuccess)
                    .catch((error) => console.log(error.response.data));
            },

            newLongStory: function() {
                alert("Say hello");
            },

            showAdditionalAmount: function() {
                this.additionalAmount = true;
            },

            getSocials: function() {
                axios
                    .get("/my_project/get_socials/" + this.projectid)
                    .then((res) => {
                        const data = res.data;
                        for (let key in data) {
                            const social = data[key];
                            console.log(social[link]);
                        }
                    })
                    .catch((error) => console.log(error));
            },
            newRewardClick: function(id) {
                axios
                    .post("/my_project/new_reward/" + id, {})
                    .then((response) =>
                        this.rewards.push({
                            reward_currency: response.data.curr,
                            reward_id: response.data.desc,
                            name: "",
                            reward_amount: "",
                            delivery_date: "",
                            shipping_details: "",
                            local_shipping_cost: "",
                            intl_shipping_cost: "",
                            reward_photo_upload: "",
                            limit_reward_amount1: "",
                            reward_quantity: "",
                            rewarddescription: "",
                        })
                    )
                    .catch((error) => console.log(error.response.data));
            },

            buyReward: function(id) {
                console.log(id);
            },
            rewardDelete(index) {
                this.rewards.splice(index, 1);
            },

            onSuccess(response) {
                console.log(response.data);
            },
            reward: function(id) {
                console.log(id);
            },
        },
    });