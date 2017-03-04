import { Injectable } from '@angular/core';
import * as xml2json from 'xml2json';

import { TextStringService } from '../service/textstring.service';
import { EppHelperService, EppMessageAndStatus } from '../epp/epphelper.service';
import * as hostepp from '../epp/hostepp.template';
import { HostDetail, HostCheckResult } from './host.model';
import {
  extractExtension, extractText, extractStatuses, extractType, extractAvail
} from '../epp/epputil';

/**
 * Hosts epp service
 *
 * <p>
 * Sends and receives host related epp xml messages. For more information about
 * host related epp xml messages, see
 * {@link https://tools.ietf.org/html/rfc5732}
 * </p>
 */
@Injectable()
export class HostEppService {
  constructor(private text: TextStringService,
    private eppHelper: EppHelperService) {}


  /**
   * Host info epp command
   *
   * @param hostname Fully qualified host name
   */
  infoHost(hostname: string): Promise<HostDetail> {
    return new Promise<HostDetail>((resolve, reject) => {
      const clTrid = this.text.EPP_CLTRID;
      const xml = hostepp.hostInfo(hostname, clTrid);
      this.eppHelper.send(xml).forEach(result => {
        const resultData = result['epp']['response']['resData']['host:infData'];
        const host: HostDetail = {
          inetAddresses: extractInetAddresses(resultData),
          status: extractStatuses(resultData, 'host:status'),
          fullyQualifiedHostName: extractText(resultData, 'host:name'),
          repoId: extractText(resultData, 'host:roid'),
          currentSponsorClientId: extractText(resultData, 'host:clID'),
          creationClientId: extractText(resultData, 'host:crID'),
          creationTime: extractText(resultData, 'host:crDate'),
          lastEppUpdateClientId: extractText(resultData, 'host:upID'),
          lastEppUpdateTime: extractText(resultData, 'host:upDate'),
          lastTransferTime: extractText(resultData, 'host:trDate'),
        };
        resolve(host);
      }).catch(err => {
        reject(err);
      });
    });
  }

  /**
   * Host check epp command
   *
   * @param hostname Fully qualified host name
   */
  checkHost(hostname: string): Promise<HostCheckResult> {
    return new Promise<HostCheckResult>((resolve, reject) => {
      const clTrid = this.text.EPP_CLTRID;
      const xml = hostepp.hostCheck(hostname, clTrid);
      this.eppHelper.send(xml).forEach(result => {
        // expect a single check result back
        // if multiple check results are found, show the first one.
        const resultData = result['epp']['response']['resData']['host:chkData'];
        let checkData = resultData['host:cd'];
        if (Array.isArray(checkData)) {
          checkData = checkData[0];
        }
        const checkResult: HostCheckResult = {
          fullyQualifiedHostName: extractText(checkData, 'host:name'),
          avail: extractAvail(checkData, 'host:name'),
          reason: extractText(checkData, 'host:reason'),
        };
        resolve(checkResult);
      }).catch(err => {
        reject(err);
      });
    });
  }

  /**
   * Host create epp command
   *
   * @param name Fully qualified host name
   * @param addr Ip addresses
   */
  createHost(name: string, addr: Array<string>): Promise<EppMessageAndStatus> {
    return new Promise<EppMessageAndStatus>((resolve, reject) => {
      const clTrid = this.text.EPP_CLTRID;
      const hostCreateData = {
        'host:name': name,
        'host:addr': addr.map(ipAddress => {
          return {value: ipAddress};
        })
      };
      const xml = hostepp.hostCreate(hostCreateData, clTrid);
      this.eppHelper.send(xml).forEach(result => {
        resolve(this.eppHelper.getEppMessageAndStatus(result));
      }).catch(err => {
        reject(err);
      });
    });
  }

  /**
   * Host update epp command
   *
   * @param name Fully qualified host name
   * @param updateInfo List of host properties to be updated
   */
  updateHost(name: string, updateInfo: hostepp.HostUpdateInfo): Promise<EppMessageAndStatus> {
    return new Promise<EppMessageAndStatus>((resolve, reject) => {
      const clTrid = this.text.EPP_CLTRID;
      const item = {
        'host:name': name,
        'host:chgName': name,
      };
      const xml = hostepp.hostUpdate(item, clTrid, updateInfo);
      this.eppHelper.send(xml).forEach(result => {
        resolve(this.eppHelper.getEppMessageAndStatus(result));
      }).catch(err => {
        reject(err);
      });
    });
  }

  /**
   * Host delete epp command
   *
   * @param name Fully qualified host name
   */
  deleteHost(name: string): Promise<EppMessageAndStatus> {
    return new Promise<EppMessageAndStatus>((resolve, reject) => {
      const clTrid = this.text.EPP_CLTRID;
      const xml = hostepp.hostDelete(name, clTrid);
      this.eppHelper.send(xml).forEach(result => {
        resolve(this.eppHelper.getEppMessageAndStatus(result));
      }).catch(err => {
        reject(err);
      });
    });
  }
}

function extractInetAddresses(resultData: any): Array<string> {
  const inetAddresses: Array<string> = [];
  if ('host:addr' in resultData) {
    let hostAddr = resultData['host:addr'];
    if (!Array.isArray(hostAddr)) {
      hostAddr = [ hostAddr ];
    }
    for (const addr of hostAddr) {
      inetAddresses.push(addr['keyValue']);
    }
  }
  return inetAddresses;
}
