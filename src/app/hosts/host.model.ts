
export interface HostDetail {
  fullyQualifiedHostName: string;
  repoId: string;
  status: Array<string>;
  inetAddresses: Array<string>;
  currentSponsorClientId: string;
  creationClientId: string;
  creationTime: string;
  lastEppUpdateClientId?: string;
  lastEppUpdateTime?: string;
  lastTransferTime?: string;
}

export interface HostCheckResult {
  fullyQualifiedHostName: string;
  avail: boolean;
  reason?: string;
}
