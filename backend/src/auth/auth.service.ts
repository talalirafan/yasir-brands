import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from '../users/schemas/user.schema';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  private sign(user: UserDocument) {
    const payload = { sub: user._id, email: user.email, role: user.role, name: user.name };
    return this.jwtService.sign(payload);
  }

  private sanitize(user: UserDocument) {
    const { _id, name, email, phone, role } = user;
    return { _id, name, email, phone, role };
  }

  async signup(dto: SignupDto) {
    const existing = await this.userModel.findOne({ email: dto.email });
    if (existing) throw new ConflictException('Email already registered');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.userModel.create({ ...dto, password: hashed });

    return { user: this.sanitize(user), token: this.sign(user) };
  }

  async login(dto: LoginDto) {
    const user = await this.userModel
      .findOne({ $or: [{ email: dto.email }, { phone: dto.email }] })
      .select('+password');
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return { user: this.sanitize(user), token: this.sign(user) };
  }

  async adminLogin(dto: LoginDto) {
    const result = await this.login(dto);
    if (result.user.role !== 'admin') {
      throw new UnauthorizedException('Not an admin account');
    }
    return result;
  }
}
