import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'models/announcement_model.dart';

final announcementsProvider = Provider<List<AnnouncementModel>>((ref) {
  return [
    AnnouncementModel(
      id: 'conecta_growth_reset',
      title: '¡Algo Increíble Sucedió!',
      subtitle: 'NOTICIA IMPORTANTE PARA LA COMUNIDAD',
      content: 'Estamos impactados por su apoyo. En solo 3 días superamos las 20,000 visitas y 700 registros. Esta "cosa loca e increíble" superó nuestras expectativas y tuvimos que migrar a una infraestructura más potente.',
      isCritical: true,
      actionText: '¡VAMOS! CREAR MI CUENTA NUEVA',
      actionUrl: '/register',
      stats: [
        AnnouncementStat(label: 'VISITAS', value: '+20,000'),
        AnnouncementStat(label: 'REGISTROS', value: '+700'),
      ],
      publishedAt: DateTime.now(),
    ),
  ];
});
