import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class DbConfigService {
    constructor(
        private configservice: ConfigService
    ) {}

    get dbhost() {
        return this.configservice.get<string>('DATABASE_HOST')
    }
    get dbport() {
        return this.configservice.get<number>('DATABASE_PORT')
    }
    get dbuser() {
        return this.configservice.get<string>('DATABASE_USER')
    }
    get dbpassword() {
        return this.configservice.get<string>('DATABASE_PASSWORD')
    }
    get dbname() {
        return this.configservice.get<string>('DATABASE_NAME')
    } 
}