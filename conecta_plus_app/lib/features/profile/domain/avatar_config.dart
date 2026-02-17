import 'dart:convert';

class AvatarConfig {
  final int skinColorIndex;
  final int hairStyleIndex;
  final int hairColorIndex;
  final int eyeStyleIndex;
  final int mouthStyleIndex;
  final int outfitIndex;
  final int backgroundColorIndex;
  final int accessoryIndex; // 0 = None, 1 = Glasses, etc.

  const AvatarConfig({
    this.skinColorIndex = 0,
    this.hairStyleIndex = 0,
    this.hairColorIndex = 0,
    this.eyeStyleIndex = 0,
    this.mouthStyleIndex = 0,
    this.outfitIndex = 0,
    this.backgroundColorIndex = 0,
    this.accessoryIndex = 0,
  });

  AvatarConfig copyWith({
    int? skinColorIndex,
    int? hairStyleIndex,
    int? hairColorIndex,
    int? eyeStyleIndex,
    int? mouthStyleIndex,
    int? outfitIndex,
    int? backgroundColorIndex,
    int? accessoryIndex,
  }) {
    return AvatarConfig(
      skinColorIndex: skinColorIndex ?? this.skinColorIndex,
      hairStyleIndex: hairStyleIndex ?? this.hairStyleIndex,
      hairColorIndex: hairColorIndex ?? this.hairColorIndex,
      eyeStyleIndex: eyeStyleIndex ?? this.eyeStyleIndex,
      mouthStyleIndex: mouthStyleIndex ?? this.mouthStyleIndex,
      outfitIndex: outfitIndex ?? this.outfitIndex,
      backgroundColorIndex: backgroundColorIndex ?? this.backgroundColorIndex,
      accessoryIndex: accessoryIndex ?? this.accessoryIndex,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'skinColorIndex': skinColorIndex,
      'hairStyleIndex': hairStyleIndex,
      'hairColorIndex': hairColorIndex,
      'eyeStyleIndex': eyeStyleIndex,
      'mouthStyleIndex': mouthStyleIndex,
      'outfitIndex': outfitIndex,
      'backgroundColorIndex': backgroundColorIndex,
      'accessoryIndex': accessoryIndex,
    };
  }

  factory AvatarConfig.fromMap(Map<String, dynamic> map) {
    return AvatarConfig(
      skinColorIndex: map['skinColorIndex']?.toInt() ?? 0,
      hairStyleIndex: map['hairStyleIndex']?.toInt() ?? 0,
      hairColorIndex: map['hairColorIndex']?.toInt() ?? 0,
      eyeStyleIndex: map['eyeStyleIndex']?.toInt() ?? 0,
      mouthStyleIndex: map['mouthStyleIndex']?.toInt() ?? 0,
      outfitIndex: map['outfitIndex']?.toInt() ?? 0,
      backgroundColorIndex: map['backgroundColorIndex']?.toInt() ?? 0,
      accessoryIndex: map['accessoryIndex']?.toInt() ?? 0,
    );
  }

  String toJson() => json.encode(toMap());

  factory AvatarConfig.fromJson(String source) =>
      AvatarConfig.fromMap(json.decode(source));

  @override
  String toString() {
    return 'AvatarConfig(skinColorIndex: $skinColorIndex, hairStyleIndex: $hairStyleIndex, hairColorIndex: $hairColorIndex, eyeStyleIndex: $eyeStyleIndex, mouthStyleIndex: $mouthStyleIndex, outfitIndex: $outfitIndex, backgroundColorIndex: $backgroundColorIndex, accessoryIndex: $accessoryIndex)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is AvatarConfig &&
        other.skinColorIndex == skinColorIndex &&
        other.hairStyleIndex == hairStyleIndex &&
        other.hairColorIndex == hairColorIndex &&
        other.eyeStyleIndex == eyeStyleIndex &&
        other.mouthStyleIndex == mouthStyleIndex &&
        other.outfitIndex == outfitIndex &&
        other.backgroundColorIndex == backgroundColorIndex &&
        other.accessoryIndex == accessoryIndex;
  }

  @override
  int get hashCode {
    return skinColorIndex.hashCode ^
        hairStyleIndex.hashCode ^
        hairColorIndex.hashCode ^
        eyeStyleIndex.hashCode ^
        mouthStyleIndex.hashCode ^
        outfitIndex.hashCode ^
        backgroundColorIndex.hashCode ^
        accessoryIndex.hashCode;
  }
}
