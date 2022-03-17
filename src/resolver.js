export function getCurrentPath() {
  return window.location.pathname.replace('/', ''); 
}

export function parse(path){
    let sections = path.split(':');
    let type = sections[0].toUpperCase();
    let address = sections[1];


    if(!(type in exceptions)){
        return {address, type};
    } else {
        return exceptions[type.toUpperCase()](sections);
    }
}

export function queryGoogleDNSResolver(address, type, callback) {
  let url = `https://dns.google.com/resolve?name=${address}&type=${type}`;
  fetch(url)
    .then(res => res.json())
    .then(json => {
      callback(json);
    });
}

export const filters = {
    'SPF': (records) => {
        return records.filter(item => item.includes('v=spf1',0));
    },
    'DKIM': (records) => {
        return records.filter(item => item.includes('v=DKIM1',0));
    },
    'DMARC': (records) => {
        return records.filter(item => item.includes('v=DMARC',0));
    }
}

export const exceptions = {
    'DKIM' : (sections) => {
        let address = `${sections[2]}._domainkey.${sections[1]}`;
        let type = 'TXT';

        return {address, type};
    },
    'SPF' : (sections) => {
        let address = `${sections[1]}`;
        let type = 'TXT';

        return {address, type};
    },
    'DMARC' : (sections) => {
        let address = `_dmarc.${sections[1]}`;
        let type = 'TXT';

        return {address, type};
    }
}