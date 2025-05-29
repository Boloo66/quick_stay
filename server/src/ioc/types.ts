const TYPES = {
  // ------------------------ Register Others TYPES Here --------------//

  UndiciRequest: Symbol.for('UndiciRequest'),
  LoggerService: Symbol.for('LoggerService'),
  ConfigService: Symbol.for('ConfigService'),
  HotelService: Symbol.for('HotelService'),

  // ------------------------ Register Repositories TYPES Here --------------//
  HotelRepository: Symbol.for('HotelRepository'),
  // ------------------------ Register Services TYPES Here --------------//
  // ------------------------ Register Controllers TYPES Here --------------//
  HotelController: Symbol.for('HotelController'),

  // -------------------------- Register Router TYPES Here --------------//
  HotelRouter: Symbol.for('HotelRouter'),
  V1Router: Symbol.for('V1Router'),
};

export { TYPES };
