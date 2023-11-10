import {Platform} from 'react-native';
import axios from 'axios';
import i18n from './i18n';

const environment = 'dev'; //dev || prod

const baseUrlApi = 'https://app.balletworkout.be/api/v1/';
const baseServerUri = 'https://app.balletworkout.be/';

const baseShopServerApi = 'https://tatevikballet.com/api/rest/';

const termsUrl = 'https://miessen.io/Terms.html';
const policyUrl = 'https://miessen.io/Privacy.html';
const supportUrl = 'https://app.balletworkout.be/support';

// const baseUrlApi = Platform.OS === 'ios' ? 'http://localhost:8888/balletWorkoutAdmin/api/v1/' : 'http://192.168.1.101:8888/balletWorkoutAdmin/api/v1/';
// const baseServerUri = Platform.OS === 'ios' ? 'http://localhost:8888' : 'http://192.168.1.101:8888/';

// const baseShopServerApi = 'http://192.168.1.101/api/rest/';

const jwtPubKey = `-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA1Np87WvLBXs1t6fgPjMM
ZRy5K5TwNhTUU+QglHVGky8en7UyomQwOItENqLpzdOFpuiO34c6RjB26akTFmxu
vjisACZmly7KXdIuU/xldtMg5wLT091TKreg+6x7w5tD2iqiPXMmYrcdX+HejbX2
pki4Qd1PEw7tBC1K4Nfw9WwwDo+W1KDfCwf/WkSekntgJrw+GbgtHHs7FSskjZgR
c4z/d35yPCVyNCDiseCh04MHj/CjGVV17rmr0BUSGxmPbhR4RnjNXQN17vR1CZJh
VdotstST+mmtRM8exAymajDhQC2DfbIDRJ2fVWVJcw9zceCDQlEtOCOr+ULV0WJk
gCRxnIQdq3MkeAwamd+cJZCXsBcC1ge72LE7rYmT4CUqQDIsmBD4uUz3mFaORwlQ
MM/HGUh2O/0Ez4lgpB1al8AeFqH4gXsvhtSQef9gco9f6IR636fPDJfYsOUwsLeD
9QPYoubzEN/bucswrSWw4Owu/QtKJPwqrdFrIrFRK2SMXDxha1c4vNIJ4Lg4DOET
b3L+L4D8dn/aZ5hg+NSbgWEygdAdH7MJTZsypxrBJjOTa0fh3LiOShSrmU05cw7v
na5nLfuCSKAkys+i8Z7ylj6rCpdzx6Cgv7DTpXEdSacNhsBvsygGekFGCw9lbLAV
Rqeod+ZomUA3wwwh1KtKOssCAwEAAQ==
-----END PUBLIC KEY-----`;

const HTTP = axios.create({
  baseURL: baseUrlApi,
  headers: [{'Content-Type': 'application/json'}],
});

export {
  baseUrlApi,
  baseServerUri,
  jwtPubKey,
  HTTP,
  baseShopServerApi,
  termsUrl,
  policyUrl,
  supportUrl,
};
