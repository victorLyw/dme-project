<template>
  <div class="protocol-box register-agreement-box" v-show="isDocRisk">
    <h2 class="agreement-txt-title">风险揭示书</h2>
    <p class="txt-call">场外期权投资风险</p>
    <p class="txt-paragraph">&nbsp;&nbsp;1.最大可能损失：与普通金融工具相比，场外期权交易具有一定的杠杆性，波动性强，会放大收益或损失，属于高风险投资品种。由于各种风险因素的存在，所预期的规避风险、保值、获利等交易目标不一定能够实现，计划的资产有可能大幅贬值，甚至可能发生全部权利金亏损。</p>
    <p class="txt-paragraph">&nbsp;&nbsp;2.市场风险：由于货币政策、财政政策、产业政策等国家政策及法律法规的变化，或者政治、金融及宏观经济形势变化，导致市场利率变化和证券价格波动影响交易合约价值变化，从而导致交易发生损失。</p>
    <p class="txt-paragraph">&nbsp;&nbsp;3.流动性风险：因投资者的最终交易对手是证券公司/期货公司的风险子公司，若交易对手产生流动性风险，可能会影响投资者权益的实现。</p>
    <p class="txt-paragraph">&nbsp;&nbsp;4.操作风险：在实际交易过程中，因不完善或有问题的内部流程、人员及系统或外部事件等可能造成的交易损失。</p>
    <p class="txt-paragraph">&nbsp;&nbsp;5.法律风险：因法律法规、监管要求或市场规则变化，使交易不能被有效执行导致损失的风险；在交易对手出现交易项下约定的违约事件或终止事件时，可能会给投资者造成经济损失。</p>
    <p class="txt-paragraph">&nbsp;&nbsp;6.信用风险：因交易另一方未履行交易项下约定的各项义务而造成本基金的损失。</p>
    <p class="txt-paragraph">&nbsp;&nbsp;7.技术风险：在交易过程中，可能因为技术系统的故障或者差错而导致投资者的利益受到影响。该种技术风险可能来自证券公司、证券登记结算机构等。</p>
    <p class="txt-paragraph">&nbsp;&nbsp;8.合同变更风险：在合同签署后，交易有可能因法律、法规、规章、中国证监会的规定、证券登记结算机构业务规则、证券交易所交 易规则以及其他原因进行修订或者变更。投资者存在不同意变更合同 的条款又没在规定的时间内退出，视同同意合同变更的风险。</p>
    <p class="txt-paragraph">&nbsp;&nbsp;9.提前终止风险：本交易存续期间，若出现合同约定的终止事件，则本交易可能面临提前终止风险。</p>
    <p class="txt-paragraph">&nbsp;&nbsp;以上提示可能发生的风险由投资者自行承担，投资有风险，入场需谨慎。</p>
    <br />
    <slot>
    </slot>
    <br />
  </div>
</template>

<script>
export default {
  name: 'doc-risk-hints',
  props: {
    isDocRisk: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped lang="stylus">
.register-agreement-box
  padding 0 10px
  text-align left
  .agreement-txt-title
    font-size 1.5em
    text-align center
    margin 20px 0
  .txt-sign
    text-align right
</style>
