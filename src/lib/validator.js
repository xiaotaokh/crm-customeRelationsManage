export function validatorList(rule, list, callback) {
    if (list && list.length) {
        callback();
    } else {
        callback(new Error(rule.message));
    }
}

const CRON_TIMES_REG = [
    {
        name: 'min',
        reg: [
            /^([1-5]{0,1}\d)$/
        ]
    },
    {
        name: 'hour',
        reg: [
            /^(([1]{0,1}\d)|([2][0-3]))$/
        ]
    },
    {
        name: 'day',
        reg: [
            /^(([1-2]{0,1}\d)|([3][0-1]))$/,
            /^\*(\/[1-9]\d{0,}){0,1}$/,
            /^(([1-2]{0,1}\d)|([3][0-1]))(\-(([1-2]{0,1}\d)|([3][0-1]))){0,1}$/,
            /^(([1-2]{0,1}\d)|([3][0-1]))(\,(([1-2]{0,1}\d)|([3][0-1]))){0,}$/,
        ]
    },
    {
        name: 'month',
        reg: [
            /^(([1-9])|([1][0-2]))$/,
            /^\*(\/[1-9]\d{0,}){0,1}$/,
            /^(([1-9])|([1][0-2]))(\-(([1-9])|([1][0-2]))){0,1}$/,
            /^(([1-9])|([1][0-2]))(\,(([1-9])|([1][0-2]))){0,}$/,
        ]
    },
    {
        name: 'week_day',
        reg: [
            /^[0-6]$/,
            /^\*(\/[1-7]){0,1}$/,
            /^[0-6](\-[0-6]){0,1}$/,
            /^[0-6](\,[0-6]){0,}$/
        ]
    },
];
export function validatorCronTimes(rule, cronTimes, callback) {
    if (CRON_TIMES_REG.every(item => {
        return item.reg.some(r=>{
           return r.test(cronTimes[item.name]);
        })
    })) {
        callback();
    }else {
        callback(new Error(rule.message));
    }
}
