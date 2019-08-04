/**
 * Distills status info into pre-defined strings.
 */

import {current_status} from 'site24x7.com';

try {

    let distill = (status)=>{
        if (status == 0){
            return 'down';
        } else if (status == 1){
            return 'up';
        } else if (status == 2){
            return 'partial';
        } else if (status == 5 || status == 7) {
            return 'maintenance';
        } else {
            return 'partial';
        }
    };

    let current = current_status.get();

    // Assumes the first group contains what we want.
    // Alternatively we could use an explicit group ID, or combine results from all groups.
    let group = current.data.monitor_groups[0];
    let monitors = group.monitors;

    let overall = distill(group.status);

    let out = {status: overall, monitors: [], last: ''};

    let lastTime = '';

    monitors.forEach((monitor)=>{
        out.monitors.push({
            name: monitor.name,
            status: distill(monitor.status),
            last: monitor.last_polled_time
        });
        if (monitor.last_polled_time > lastTime){
            lastTime = monitor.last_polled_time;
        }
    });

    out.last = lastTime;

    out;

} catch (e){

    ({status:'error', message: e.message + '', code: e.status + ''});

}

