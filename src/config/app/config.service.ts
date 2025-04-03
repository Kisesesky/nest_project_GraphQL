import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class AppConfigService {
    constructor(
        private configservice: ConfigService
    ) {}

    get jwtSecret() {
        return this.configservice.get<string>('app.jwtSecret')
    }
    get jwtRefreshSecret() {
        return this.configservice.get<string>('app.jwtRefreshSecret')
    }
    get port() {
        return this.configservice.get<string>('app.port')
    }
}
