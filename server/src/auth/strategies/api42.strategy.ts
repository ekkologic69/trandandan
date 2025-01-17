import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Strategy } from 'passport-42';
import { HttpService } from '@nestjs/axios';
import { User } from '@prisma/client';
import { lastValueFrom } from 'rxjs';
import { AuthDto } from '../dto';

@Injectable()
export class Api42Strategy extends PassportStrategy(Strategy) {
	constructor(
		private authService: AuthService,
		private httpService: HttpService
	) {
		super({
			clientID: process.env.USER_ID,
			clientSecret: process.env.USER_SECRET,
			callbackURL: process.env.CALLBACK_URL
		});
	}
	async validate(accessToken: string): Promise<User | undefined> {
		const response = await lastValueFrom(
			this.httpService.get<AuthDto>('https://api.intra.42.fr/v2/me', {
				headers: { Authorization: `Bearer ${accessToken}` }
			})
		);
		const data: AuthDto = response.data;
		return this.authService.loginIntra(data);
	}
}
