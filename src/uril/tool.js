import { service } from "src/services/api";
import { ref } from "vue";

export const tool = {
  getUnit(unit) {
    switch (unit) {
      case "USD": {
        return "$";
      }
    }
  },

  async getIp() {
    try {
      const response = await service.getIp();
      return response.data.data.ip;
    } catch (error) {
      console.log(error);

      return "";
    }
  },

  async getCode(ip) {
    const countryDialCode = {};
    try {
      // const data = await getLocation(ip);
      countryDialCode.countryCode = data.country_code;
      countryDialCode.countryDialCode = data.country_dial_code;
      const idx = countryCodeDialMap.find((item) => {
        item.countryCode === countryDialCode.value.countryCode;
        item.dailCode === countryDialCode.value.countryDialCode;
      });
      if (idx === -1) {
        countryDialCode.countryCode = countryCodeDialMap[0].countryCode;
        countryDialCode.countryDailCode = countryCodeDialMap[0].dailCode;
      }
    } catch (error) {
      countryDialCode.countryCode = countryCodeDialMap[0].countryCode;
      countryDialCode.countryDailCode = countryCodeDialMap[0].dailCode;
      console.log(error);
    }
    console.log(countryDialCode);

    return countryDialCode;
  },
};

export const countryCodeDialMap = [
  {
    countryCode: "US",
    dailCode: "+1",
  },
  {
    countryCode: "GB",
    dailCode: "+44",
  },
  {
    countryCode: "CA",
    dailCode: "+1",
  },
  {
    countryCode: "AU",
    dailCode: "+61",
  },
  {
    countryCode: "IE",
    dailCode: "+353",
  },
  {
    countryCode: "SG",
    dailCode: "+65",
  },
];
