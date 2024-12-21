import { service } from "src/services/api";
import { ref } from "vue";
import { mergeWith } from "lodash";
import { v4 as uuidv4 } from "uuid";
import OSS from "ali-oss";
import { DateTime } from "luxon";
import Cookies from "js-cookie";
import { getLocation } from "src/composables/user";

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
      const data = await getLocation(ip);
      countryDialCode.countryCode = data.country_code;
      const target = countryCodeDialMap.find((item) => {
        item.countryCode === countryDialCode.countryCode;
      });
      if (target === undefined) {
        countryDialCode.countryCode = countryCodeDialMap[0].countryCode;
        countryDialCode.countryDailCode = countryCodeDialMap[0].dailCode;
      } else {
        countryDialCode.countryDailCode = target.dailCode;
      }
    } catch (error) {
      countryDialCode.countryCode = countryCodeDialMap[0].countryCode;
      countryDialCode.countryDailCode = countryCodeDialMap[0].dailCode;
      console.log(error);
    }

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

export function merge(target, source) {
  mergeWith(target, source, (objValue, srcValue) => {
    // 如果后端返回 null 或 undefined，保留原值
    if (srcValue === null || srcValue === undefined) {
      return objValue;
    }
    return srcValue; // 其他情况使用后端的值
  });
}

const headers = {
  // 指定Object的存储类型。
  "x-oss-storage-class": "Standard",
  // 设置Object的标签，可同时设置多个标签。
  // "x-oss-tagging": "Tag1=1&Tag2=2",
  // 指定PutObject操作时是否覆盖同名目标Object。此处设置为true，表示禁止覆盖同名Object。
  "x-oss-forbid-overwrite": "true",
};

// files is an array of obj {
//    file: File,
// .  name: string,
//    url: string,
//}
export async function uploadFiles(files) {
  var ossClient = null;
  try {
    ossClient = await checkToken();
  } catch (error) {
    throw error;
  }
  for (let i = 0; i < files.length; i++) {
    if (files[i].file === null) {
      continue;
    }
    const uuid = uuidv4();
    const fileAppendex = files[i].file.name.split(".")[1];
    const res = await ossClient.put(
      `/files/img/${uuid}.${fileAppendex}`,
      files[i].file,
      { headers }
    );
    files[i].url = res.url;
  }

  return files;
}

async function checkToken() {
  const tokenRaw = Cookies.get("token");
  var token = null;
  if (tokenRaw === undefined) {
    try {
      token = await getToken();
    } catch (error) {
      throw error;
    }
    Cookies.set("token", JSON.stringify(token));
  } else {
    token = JSON.parse(tokenRaw);

    const tokenExpirationTime = DateTime.fromISO(token.expiration).toUTC();
    const timeNow = DateTime.now().toUTC();
    const timeDiff = timeNow.diff(tokenExpirationTime, "minutes").minutes;

    if (timeDiff > 0) {
      token = await getToken();
      Cookies.set("token", JSON.stringify(token));
    }
  }
  return new OSS({
    bucket: "mikasa97",
    region: "oss-us-east-1",
    accessKeyId: token.access_key_id,
    accessKeySecret: token.access_key_secret,
    stsToken: token.security_token,
  });
}

async function getToken() {
  try {
    const response = await service.getOssToken({});
    return response.data.data;
  } catch (error) {
    throw error;
  }
}
